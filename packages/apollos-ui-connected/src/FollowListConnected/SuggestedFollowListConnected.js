import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import { named, H4 } from '@apollosproject/ui-kit';
import GET_SUGGESTED_FOLLOWS from './getSuggestedFollows';
import FollowListConnected from './FollowListConnected';

const SuggestedFollowListConnected = ({
  Component,
  Header,
  refetchRef,
  ...props
}) => {
  const { data, loading, refetch } = useQuery(GET_SUGGESTED_FOLLOWS, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (refetch && refetchRef)
      refetchRef({ refetch, id: 'suggested-follow-list' });
  }, []);

  const suggestedFollows = data?.suggestedFollows || [];

  return (
    <Component
      header={Header}
      loading={loading}
      followers={suggestedFollows}
      {...props}
    />
  );
};

SuggestedFollowListConnected.propTypes = {
  // Custom component to be rendered. Defaults to Features
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object,
  ]),
  Header: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object,
  ]),
  refetchRef: PropTypes.func,
};

SuggestedFollowListConnected.defaultProps = {
  Component: FollowListConnected,
  Header: <H4>{'Suggested Followers'}</H4>,
};

SuggestedFollowListConnected.displayName = 'SuggestedFollowListConnected';

export default named('ui-connected.SuggestedFollowListConnected')(
  SuggestedFollowListConnected
);
