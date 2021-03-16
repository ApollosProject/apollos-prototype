import { createGlobalId } from '@apollosproject/server-core';
import { sequelize, sync } from '../../postgres/index';
import { createModel, setupModel } from '../model';
import {
  createModel as createCommentModel,
  setupModel as setupCommentModel,
} from '../../comments/model';
import { createModel as createPeopleModel } from '../../people/model';
import { createModel as createFollowModel } from '../../follows/model';
import CommentDataSource from '../../comments/dataSource';
import UserFlagDataSource from '../dataSource';

let person1;
let person2;
let currentPerson;
const context = {
  dataSources: {
    Person: {
      getCurrentPersonId: () => currentPerson.id,
    },
  },
};

describe('Apollos Postgres Comment Flags DataSource', () => {
  let comment;
  let commentDataSource;

  beforeEach(async () => {
    await createCommentModel();
    await createPeopleModel();
    await createFollowModel();
    await createModel();
    await setupModel();
    await setupCommentModel();
    await sync();

    person1 = await sequelize.models.people.create({
      originId: '1',
      originType: 'rock',
    });
    person2 = await sequelize.models.people.create({
      originId: '2',
      originType: 'rock',
    });
    currentPerson = person1;

    commentDataSource = new CommentDataSource();
    commentDataSource.initialize({ context });

    comment = await commentDataSource.addComment({
      text: 'I am a fun comment!',
      parentId: createGlobalId(123, 'UniversalContentItem'),
    });
  });

  afterEach(async () => {
    await sequelize.drop({});
  });

  it('should support flagging comment', async () => {
    const userFlagDataSource = new UserFlagDataSource();
    userFlagDataSource.initialize({ context });

    const flaggedComment = await userFlagDataSource.flagComment({
      commentId: comment.apollosId,
    });

    expect(flaggedComment.id.toString()).toBe(comment.id.toString());
    expect(flaggedComment.apollosId).toBe(`Comment:${comment.id}`);
  });

  it('should increment flag count on comment', async () => {
    const userFlagDataSource = new UserFlagDataSource();
    userFlagDataSource.initialize({ context });

    await userFlagDataSource.flagComment({
      commentId: comment.apollosId,
    });

    const updatedComments = await commentDataSource.getForNode({
      nodeId: 123,
      nodeType: 'UniversalContentItem',
    });

    expect(updatedComments[0].flagCount).toBe(1);
  });

  it('should only increment count for new flags', async () => {
    const userFlagDataSource = new UserFlagDataSource();
    userFlagDataSource.initialize({ context });

    // Try to have the same user flag a comment twice
    await userFlagDataSource.flagComment({
      commentId: comment.apollosId,
    });
    await userFlagDataSource.flagComment({
      commentId: comment.apollosId,
    });

    const updatedComments = await commentDataSource.getForNode({
      nodeId: 123,
      nodeType: 'UniversalContentItem',
    });

    // Should only record one flag
    expect(updatedComments[0].flagCount).toBe(1);

    // Have another user flag it though...
    currentPerson = person2;
    await userFlagDataSource.flagComment({
      commentId: comment.apollosId,
    });

    // And now the count is incremented
    const updatedAgainComments = await commentDataSource.getForNode({
      nodeId: 123,
      nodeType: 'UniversalContentItem',
    });

    expect(updatedAgainComments[0].flagCount).toBe(2);
  });

  it('should return a user for a flag', async () => {
    const userFlagDataSource = new UserFlagDataSource();
    userFlagDataSource.initialize({ context });

    const flaggedComment = await userFlagDataSource.flagComment({
      commentId: comment.apollosId,
    });

    const flag = await sequelize.models.user_flags.findOne({
      nodeId: flaggedComment.apollosId,
    });

    const flagPerson = await sequelize.models.people.findByPk(flag.personId);
    expect(flagPerson.id).toEqual(currentPerson.id);
  });
});
