import { graphql } from 'graphql';
import { createTestHelpers } from '@apollosproject/server-core/lib/testUtils';

import {
  commentSchema,
  peopleSchema,
  featuresSchema,
  scriptureSchema,
  contentItemSchema,
  contentChannelSchema,
  themeSchema,
} from '@apollosproject/data-schema';
import * as Comment from '../index';
import * as Person from '../../people';
import * as Follow from '../../follows';
import * as UserFlag from '../../user-flags/index';

const { getSchema, getContext } = createTestHelpers({
  Comment,
  UserFlag,
  Person,
  Follow,
});

describe('Apollos Postgres Comment Flags Resolver', () => {
  let schema;
  let context;
  let rootValue;
  beforeEach(() => {
    schema = getSchema([
      commentSchema,
      peopleSchema,
      featuresSchema,
      scriptureSchema,
      contentItemSchema,
      contentChannelSchema,
      themeSchema,
    ]);
    context = getContext();
    rootValue = {};
  });

  it('adds new comment', async () => {
    const query = `
      mutation addComment {
        addComment(text:"Jimmy is great", parentId:"WeekendContentItem:f8460101368b38c5aa9bbea8b2b8a625") {
          id
        }
      }
    `;

    context.dataSources.Comment.addComment = jest.fn(() => ({
      apollosId: 'Comment:1234',
    }));

    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
    expect(context.dataSources.Comment.addComment).toBeCalled();
  });

  it('flags comment', async () => {
    const query = `
      mutation flagComment {
        flagComment(commentId: "Comment:be7381e9c2fea9f41504cd98d4b14321") {
          id
        }
      }
    `;

    context.dataSources.UserFlag.flagComment = jest.fn(() => ({
      apollosId: 'UserFlag:1234',
    }));

    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
    expect(context.dataSources.UserFlag.flagComment).toBeCalled();
  });
});
