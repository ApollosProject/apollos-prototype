import { FollowState } from './model';

const resolvers = {
  Mutation: {
    requestFollow: (root, args, { dataSources: { Follow } }) =>
      Follow.requestFollow(args),
    acceptFollowRequest: (root, args, { dataSources: { Follow } }) =>
      Follow.acceptFollowRequest(args),
    ignoreFollowRequest: (root, args, { dataSources: { Follow } }) =>
      Follow.ignoreFollowRequest(args),
  },
  Follow: {
    following: ({ state }) => state === FollowState.ACCEPTED,
  },
  Query: {
    followRequests: (root, args, { dataSources: { Follow } }) =>
      Follow.followRequests(args),
  },
};

export default resolvers;