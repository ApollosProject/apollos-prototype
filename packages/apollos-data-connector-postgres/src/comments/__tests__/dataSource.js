import { createGlobalId } from '@apollosproject/server-core';
import { range } from 'lodash';
import { sequelize, sync } from '../../postgres/index';
import { createModel } from '../model';
import { createModel as createFlagsModel } from '../../user-flags/model';
import CommentDataSource from '../dataSource';
import UserFlagDataSource from '../../user-flags/dataSource';

const context = {
  dataSources: {
    Auth: {
      getCurrentPerson: () => ({ id: 1 }),
    },
    Person: {
      getFromId: () => ({ id: 1 }),
    },
  },
};

describe('Apollos Postgres Comments DatSource', () => {
  beforeEach(async () => {
    try {
      await createModel();
      await createFlagsModel();
      await sync({ force: true });
    } catch (e) {
      console.error(e);
    }
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
    expect(comment.apollosId).toBe(createGlobalId(comment.id, 'Comment'));
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
    context.dataSources.Auth.getCurrentPerson = () => ({ id: 2 });
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
    context.dataSources.Auth.getCurrentPerson = () => ({ id: 1 });
    const itemComments = await commentDataSource.getForNode({
      nodeId: 123,
      nodeType: 'UniversalContentItem',
    });
    expect(itemComments.length).toBe(5);
  });

  it('should return your private comments', async () => {
    const commentDataSource = new CommentDataSource();
    // Change the user id to a different user
    context.dataSources.Auth.getCurrentPerson = () => ({ id: 2 });
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
    context.dataSources.Auth.getCurrentPerson = () => ({ id: 1 });
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

  it('should return a user for a comment', async () => {
    const commentDataSource = new CommentDataSource();
    commentDataSource.initialize({ context });

    const comment = await commentDataSource.addComment({
      text: `I am a fun comment!`,
      parentId: createGlobalId(123, 'UniversalContentItem'),
    });

    const commentPerson = await commentDataSource.getPerson(comment);
    expect(commentPerson).toEqual({ id: 1 });
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
      commentId: createGlobalId(comment.id, 'Comment'),
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
      commentId: createGlobalId(comment.id, 'Comment'),
    });

    const itemComments = await commentDataSource.getForNode({
      nodeId: 123,
      nodeType: 'UniversalContentItem',
      flagLimit: 1,
    });
    expect(itemComments.length).toBe(1);
    expect(itemComments[0].text).toBe('This is okay!');
  });
});
