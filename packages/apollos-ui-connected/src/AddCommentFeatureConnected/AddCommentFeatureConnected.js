import React from 'react';
import { useMutation, useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import { AddCommentInput } from '@apollosproject/ui-kit';

import GET_NODE_FEATURE_FEED from '../FeaturesFeedConnected/getFeatureFeed';
import GET_NODE_FEATURES from '../NodeFeaturesConnected/getNodeFeatures';
import GET_COMMENT_LIST_FEATURE from '../CommentListFeatureConnected/getCommentListFeature';

import GET_ADD_COMMENT_FEATURE from './getAddCommentFeature';
import ADD_COMMENT from './addComment';

const AddCommentFeatureConnected = ({
  featureId,
  Component,
  isLoading,
  refetchRef,
  onAddComment,
  ...props
}) => {
  const { data, loading, refetch } = useQuery(GET_ADD_COMMENT_FEATURE, {
    variables: {
      featureId,
    },
  });

  if (featureId && refetch && refetchRef)
    refetchRef({ refetch, id: featureId });

  const currentPerson = data?.currentUser;
  const node = data?.node;

  const addCommentUpdate = (cache, { data: { addComment: newComment } }) => {
    // Let's get started! No crashing allowed.
    // This function is brittle and will fail under a variety of circumstances.
    // That's okay for now, because what those "other circumstances" will be and if they occur
    // is pretty undefined at this point. We can revisit this in the future if needed.
    try {
      // Find the parent of this feature. We need to add the new comment to the comment list on this node.
      const parentNode = cache.readQuery({
        query: GET_NODE_FEATURES,
        variables: { nodeId: node.relatedNode.id },
      }).node;

      // Okay, we have our parent. Let's find the feature feed belonging to this parent.
      const myFeatureFeed = cache.readQuery({
        query: GET_NODE_FEATURE_FEED,
        variables: { featureFeedId: parentNode.featureFeed.id },
      }).node;

      // Nice, we have our list of features (just ids and typenames).
      // Let's find the CommentList that should be attached.
      const commentListFeatureId = myFeatureFeed.features.find(
        ({ __typename }) => __typename === 'CommentListFeature'
      ).id;

      // Now that we have our CommentListFeature, let's get the comment list.
      const commentListFeature = cache.readQuery({
        query: GET_COMMENT_LIST_FEATURE,
        variables: { featureId: commentListFeatureId },
      });

      // Finally, let's add the comment we added to that comment list.
      cache.writeQuery({
        query: GET_COMMENT_LIST_FEATURE,
        variables: { featureId: commentListFeatureId },
        data: {
          ...commentListFeature,
          node: {
            ...commentListFeature.node,
            comments: [newComment, ...commentListFeature.node.comments],
          },
        },
      });
    } catch (e) {
      console.warn('Failed to update cache after adding comment', e);
    }
  };

  const [addComment] = useMutation(ADD_COMMENT, {
    update: onAddComment || addCommentUpdate,
  });

  return (
    <Component
      {...node}
      {...props}
      loading={isLoading || loading}
      onSubmit={(text, visibility) =>
        addComment({
          variables: {
            text,
            parentId: node.relatedNode.id,
            visibility,
          },
        })
      }
      profile={currentPerson?.profile}
    />
  );
};

AddCommentFeatureConnected.propTypes = {
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object,
  ]),
  featureId: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  refetchRef: PropTypes.func,
  onAddComment: PropTypes.func,
};

AddCommentFeatureConnected.defaultProps = {
  Component: AddCommentInput,
};

export default AddCommentFeatureConnected;
