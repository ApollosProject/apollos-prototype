/* eslint-disable react-native/split-platform-components */
import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Alert, Platform, ActionSheetIOS } from 'react-native';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import GET_COMMENT_LIST_FEATURE from './getCommentListFeature';
import FLAG_COMMENT from './flagComment';
import CommentListFeature from './CommentListFeature';

const presentActionOption = ({ callback, actionText, title }) => {
  if (Platform.OS === 'ios') {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [actionText, 'Cancel'],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1,
        title,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          callback();
        }
      }
    );
  } else {
    Alert.alert(title, null, [
      {
        text: actionText,
        onPress: callback,
      },
      {
        text: 'Cancel',
        onPress: () => ({}),
        style: 'cancel',
      },
    ]);
  }
};

function CommentListFeatureConnected({
  featureId,
  Component,
  isLoading,
  refetchRef,
  ...props
}) {
  const { data, loading, refetch } = useQuery(GET_COMMENT_LIST_FEATURE, {
    variables: { featureId },
    fetchPolicy: 'cache-and-network',
  });

  const onFlagComment = (cache, { data: { flagComment } }) => {
    // Let's get started! No crashing allowed.
    try {
      // Let's find our comment list.
      const commentListFeature = cache.readQuery({
        query: GET_COMMENT_LIST_FEATURE,
        variables: { featureId },
      });

      // Now let's remove our flagged comment from that comment list.
      cache.writeQuery({
        query: GET_COMMENT_LIST_FEATURE,
        variables: { featureId },
        data: {
          ...commentListFeature,
          node: {
            ...commentListFeature.node,
            comments: commentListFeature.node.comments.filter(
              ({ id }) => id !== flagComment.id
            ),
          },
        },
      });
    } catch (e) {
      console.warn('Failed to update cache after adding comment', e);
    }
  };

  const [flagComment] = useMutation(FLAG_COMMENT, {
    update: onFlagComment,
  });

  const handlePressActionMenu = ({ id: commentId }) => {
    presentActionOption({
      callback: () => flagComment({ variables: { commentId } }),
      title: 'Report as inappropriate.',
      actionText: 'Report',
    });
  };

  if (featureId && refetch && refetchRef)
    refetchRef({ refetch, id: featureId });

  return (
    <Component
      {...get(data, 'node')}
      {...props}
      isLoading={loading || isLoading}
      onPressActionMenu={handlePressActionMenu}
      onFlagComment
    />
  );
}

CommentListFeatureConnected.propTypes = {
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object,
  ]),
  featureId: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  refetchRef: PropTypes.func,
};

CommentListFeatureConnected.defaultProps = {
  Component: CommentListFeature,
};

export default CommentListFeatureConnected;
