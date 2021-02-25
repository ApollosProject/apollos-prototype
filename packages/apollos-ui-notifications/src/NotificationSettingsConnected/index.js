import React, { useContext } from 'react';

import { PushContext } from '../pushProvider';

import NotificationSettings from './NotificationSettings';

const NotificationsConnected = () => {
  const pushStatus = useContext(PushContext);
  console.log(pushStatus);
  return <NotificationSettings notificationsEnabled={false} />;
};

NotificationsConnected.displayName = 'NotificationsConnected';
export default NotificationsConnected;
