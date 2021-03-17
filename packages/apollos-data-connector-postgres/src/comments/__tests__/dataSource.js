import { createGlobalId } from '@apollosproject/server-core';
import { range } from 'lodash';
import { sequelize, sync } from '../../postgres/index';
import { createModel, setupModel } from '../model';
import { createModel as createPersonModel } from '../../people/model';
import { createModel as createFollowModel } from '../../follows/model';
import {
  createModel as createFlagsModel,
  setupModel as setupFlagsModel,
} from '../../user-flags/model';
import CommentDataSource from '../dataSource';
import UserFlagDataSource from '../../user-flags/dataSource';

let person1;
let person2;
let person3;
let currentPerson;
const context = {
  dataSources: {
    Person: {
      getCurrentPersonId: () => currentPerson.id,
      getFromId: (id) => ({ id }),
    },
  },
};

describe('Apollos Postgres Comments DatSource', () => {
  beforeEach(async () => {
    await createModel();
    await createFlagsModel();
    await createPersonModel();
    await createFollowModel();
    await setupModel();
    await setupFlagsModel();
    await sync({ force: true });
    person1 = await sequelize.models.people.create({
      originId: '1',
      originType: 'rock',
    });
    person2 = await sequelize.models.people.create({
      originId: '2',
      originType: 'rock',
    });
    person3 = await sequelize.models.people.create({
      originId: '3',
      originType: 'rock',
    });
    currentPerson = person1;
  });
  afterEach(async () => {
    await sequelize.drop({});
  });

  it('should support creating new comments', async () => {
    const commentDataSource = new CommentDataSource();

    commentDataSource.initialize({ context });

    const comment = await commentDataSource.addComment({
      text: 'I am a fun comment!',
      parentId: createGlobalId(123, 'UniversalContentItem'),
    });

    expect(comment.text).toBe('I am a fun comment!');
    expect(comment.apollosId).toBe(`Comment:${comment.id}`);
  });

  it('should prevent creating duplicate comments', async () => {
    const commentDataSource = new CommentDataSource();
    commentDataSource.initialize({ context });

    const commentArgs = {
      text: 'I am a fun comment!',
      parentId: createGlobalId(123, 'UniversalContentItem'),
    };

    await commentDataSource.addComment(commentArgs);

    // Make sure the error assertion is made by expecting all the assertions below
    expect.assertions(2);

    try {
      await commentDataSource.addComment(commentArgs);
    } catch (e) {
      expect(e).toBeTruthy();
    }

    const comments = await commentDataSource.getForNode({
      nodeId: 123,
      nodeType: 'UniversalContentItem',
    });

    expect(comments.length).toBe(1);
  });

  it('should return comments for a given node', async () => {
    const commentDataSource = new CommentDataSource();
    commentDataSource.initialize({ context });

    // eslint-disable-next-line no-restricted-syntax
    for (const index of range(10)) {
      // eslint-disable-next-line no-await-in-loop
      await commentDataSource.addComment({
        text: `I am a fun comment #${index}!`,
        parentId: createGlobalId(123, 'UniversalContentItem'),
      });
    }

    const itemComments = await commentDataSource.getForNode({
      nodeId: 123,
      nodeType: 'UniversalContentItem',
    });
    expect(itemComments.length).toBe(10);
  });

  it('should return only public comments for a given node', async () => {
    const commentDataSource = new CommentDataSource();
    // Change the user id to a different user
    currentPerson = person2;
    commentDataSource.initialize({ context });

    // eslint-disable-next-line no-restricted-syntax
    for (const index of range(10)) {
      // eslint-disable-next-line no-await-in-loop
      await commentDataSource.addComment({
        text: `I am a fun comment #${index}!`,
        parentId: createGlobalId(123, 'UniversalContentItem'),
        visibility: index % 2 === 0 ? 'PUBLIC' : 'PRIVATE', // tag every other comment as public
      });
    }
    // Go back to our original user user
    currentPerson = person1;
    const itemComments = await commentDataSource.getForNode({
      nodeId: 123,
      nodeType: 'UniversalContentItem',
    });
    expect(itemComments.length).toBe(5);
  });

  it('should return your private comments', async () => {
    const commentDataSource = new CommentDataSource();
    // Change the user id to a different user
    currentPerson = person2;
    commentDataSource.initialize({ context });

    // eslint-disable-next-line no-restricted-syntax
    for (const index of range(5)) {
      // eslint-disable-next-line no-await-in-loop
      await commentDataSource.addComment({
        text: `I am a fun comment #${index}!`,
        parentId: createGlobalId(123, 'UniversalContentItem'),
        visibility: 'PRIVATE', // tag each comment as private
      });
    }
    // Go back to our original user user
    currentPerson = person1;
    // eslint-disable-next-line no-restricted-syntax
    for (const index of range(5)) {
      // eslint-disable-next-line no-await-in-loop
      await commentDataSource.addComment({
        text: `I am a fun comment #${index}!`,
        parentId: createGlobalId(123, 'UniversalContentItem'),
        visibility: 'PRIVATE', // tag each comment as private
      });
    }

    const itemComments = await commentDataSource.getForNode({
      nodeId: 123,
      nodeType: 'UniversalContentItem',
    });
    expect(itemComments.length).toBe(5);
  });

  it('returns all comments when flagLimit is 0', async () => {
    const commentDataSource = new CommentDataSource();
    commentDataSource.initialize({ context });

    const flagDataSource = new UserFlagDataSource();
    flagDataSource.initialize({ context });

    await commentDataSource.addComment({
      text: `This is okay!`,
      parentId: createGlobalId(123, 'UniversalContentItem'),
    });
    const comment = await commentDataSource.addComment({
      text: `This is flagged!`,
      parentId: createGlobalId(123, 'UniversalContentItem'),
    });

    await flagDataSource.flagComment({
      commentId: `Comment:${comment.id}`,
    });

    const itemComments = await commentDataSource.getForNode({
      nodeId: 123,
      nodeType: 'UniversalContentItem',
    });
    expect(itemComments.length).toBe(2);
  });

  it('should only return un-flagged comments', async () => {
    const commentDataSource = new CommentDataSource();
    commentDataSource.initialize({ context });

    const flagDataSource = new UserFlagDataSource();
    flagDataSource.initialize({ context });

    await commentDataSource.addComment({
      text: `This is okay!`,
      parentId: createGlobalId(123, 'UniversalContentItem'),
    });
    const comment = await commentDataSource.addComment({
      text: `This is flagged!`,
      parentId: createGlobalId(123, 'UniversalContentItem'),
    });

    await flagDataSource.flagComment({
      commentId: `Comment:${comment.id}`,
    });

    const itemComments = await commentDataSource.getForNode({
      nodeId: 123,
      nodeType: 'UniversalContentItem',
      flagLimit: 1,
    });
    expect(itemComments.length).toBe(1);
    expect(itemComments[0].text).toBe('This is okay!');
  });

  it('should sort your followers to the top', async () => {
    const commentDataSource = new CommentDataSource();
    commentDataSource.initialize({ context });

    currentPerson = person2;
    const comment1 = await commentDataSource.addComment({
      text: `I am not followed!`,
      parentId: createGlobalId(123, 'UniversalContentItem'),
    });

    currentPerson = person3;
    const comment2 = await commentDataSource.addComment({
      text: `I am followed! I should float to the top!`,
      parentId: createGlobalId(123, 'UniversalContentItem'),
    });

    currentPerson = person2;
    const comment3 = await commentDataSource.addComment({
      text: `I am not followed! Back to the bottom!`,
      parentId: createGlobalId(123, 'UniversalContentItem'),
    });

    currentPerson = person1;

    await sequelize.models.follows.create({
      requestPersonId: person1.id,
      followedPersonId: person3.id,
      state: 'ACCEPTED',
    });

    const itemComments = await commentDataSource.getForNode({
      nodeId: 123,
      nodeType: 'UniversalContentItem',
      flagLimit: 1,
    });
    expect(itemComments.length).toBe(3);
    expect([comment2, comment1, comment3].map(({ id }) => id)).toEqual(
      itemComments.map(({ id }) => id)
    );
  });
});
