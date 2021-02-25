import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { AppState } from 'react-native';

import { PushContext } from '../pushProvider';
import { requestPermissions } from '../permissionUtils';
import NotificationSettings from './NotificationSettings';

const NotificationsConnected = () => {
  const { updatePermissionStatus, hasPushPermission } = useContext(PushContext);
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);
  const appState = useRef(AppState.currentState);

  const handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      updatePermissionStatus(forceUpdate);
    }
    appState.current = nextAppState;
  };

  useEffect(() => {
    updatePermissionStatus();
    AppState.addEventListener('change', handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  return (
    <NotificationSettings
      allNotificationsEnabled={hasPushPermission}
      toggleNotifications={() =>
        requestPermissions(() => updatePermissionStatus(forceUpdate))
      }
    />
  );
};

NotificationsConnected.displayName = 'NotificationsConnected';
export default NotificationsConnected;
