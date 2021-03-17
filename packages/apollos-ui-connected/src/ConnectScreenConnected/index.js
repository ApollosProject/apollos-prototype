import React, { useState, useCallback } from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import PropTypes from 'prop-types';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackgroundView, styled } from '@apollosproject/ui-kit';
import { HorizontalLikedContentFeedConnected } from '../HorizontalLikedContentFeedConnected';
import {
  SuggestedFollowListConnected,
  RequestedFollowListConnected,
} from '../FollowListConnected';
import UserAvatarHeaderConnected from '../UserAvatarHeaderConnected';

const FlexedSafeAreaView = styled(
  { flex: 1 },
  'ui-connected.ConnectScreenConnected.FlexedSafeAreaView'
)(SafeAreaView);

const ConnectScreenConnected = (props) => {
  const { ActionBar, ActionTable, children } = props;

  const [refetchFunctions, setRefetchFunctions] = useState({});
  const [isRefetching, setIsRefetching] = useState(false);

  const refetchRef = useCallback(({ refetch, id }) => {
    const nextRefetchFunctions = { ...refetchFunctions, [id]: refetch };
    setRefetchFunctions(nextRefetchFunctions);
  });

  const handleRefetch = async () => {
    if (!isRefetching) {
      setIsRefetching(true);
      await Promise.all(
        Object.values(refetchFunctions).map((refetchFn) => refetchFn())
      );
      setIsRefetching(false);
    }
  };

  return (
    <BackgroundView>
      <FlexedSafeAreaView edges={['top', 'left', 'right']}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handleRefetch}
            />
          }
        >
          <UserAvatarHeaderConnected />
          {ActionBar && <ActionBar />}
          <RequestedFollowListConnected refetchRef={refetchRef} />
          <SuggestedFollowListConnected refetchRef={refetchRef} />
          <HorizontalLikedContentFeedConnected />
          {ActionTable && <ActionTable />}
          {children}
        </ScrollView>
      </FlexedSafeAreaView>
    </BackgroundView>
  );
};

ConnectScreenConnected.propTypes = {
  ActionBar: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.func,
    PropTypes.object, // covers Fragments
  ]),
  ActionTable: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.func,
    PropTypes.object,
  ]),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.object, // covers Fragments
  ]),
};

export default ConnectScreenConnected;
