import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import { named, H4 } from '@apollosproject/ui-kit';
import GET_REQUESTED_FOLLOWS from './getRequestedFollows';
import FollowListConnected from './FollowListConnected';

const RequestedFollowListConnected = ({
  Component,
  Header,
  refetchRef,
  ...props
}) => {
  const { data, loading, refetch } = useQuery(GET_REQUESTED_FOLLOWS, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (refetch && refetchRef)
      refetchRef({ refetch, id: 'requested-follow-list' });
  }, []);

  const followRequests = data?.followRequests || [];

  return (
    <Component
      header={Header}
      loading={loading}
      followers={followRequests}
      {...props}
    />
  );
};

RequestedFollowListConnected.propTypes = {
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

RequestedFollowListConnected.defaultProps = {
  Component: FollowListConnected,
  Header: <H4>{'Follow Requests'}</H4>,
};

RequestedFollowListConnected.displayName = 'SuggestedFollowListConnected';

export default named('ui-connected.SuggestedFollowListConnected')(
  RequestedFollowListConnected
);
