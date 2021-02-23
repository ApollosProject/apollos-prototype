import React from 'react';

export const PushContext = React.createContext({
  hasPrompted: true,
  hasPushPermission: true,
  loading: true,
  checkPermissions: () => {},
});

export const NotificationsConsumer = ({ children }) => children();
