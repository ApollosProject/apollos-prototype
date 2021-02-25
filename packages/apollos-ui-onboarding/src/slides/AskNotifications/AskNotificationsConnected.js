import React, { useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { NotificationsConsumer } from '@apollosproject/ui-notifications';

import AskNotifications from './AskNotifications';

function defaultGetButtonText({ hasPushPermission, hasPrompted }) {
  if (hasPushPermission) {
    return 'Notifications Enabled!';
  }
  // iOS only, hasPrompted is undefined in Android
  if (hasPrompted) {
    return 'Enable Notifications in Settings';
  }
  return 'Yes, enable notifications';
}

const AskNotificationsWithStatus = ({
  Component,
  onPressPrimary,
  onPressSecondary,
  onRequestPushPermissions,
  getButtonText,
  status,
  ...props
}) => {
  // Android has no concept of push prompt, notifications enabled by default.
  // so we'll just show them it's enabled and allow to proceed
  const ready =
    status.hasPrompted == null
      ? status.hasPushPermission || status.hasPrompted
      : status.hasPushPermission;

  useEffect(() => status.checkPermissions(), []);
  return (
    <Component
      isLoading={status.loading}
      onPressButton={() =>
        onRequestPushPermissions(status.updatePermissionStatus)
      }
      buttonDisabled={status.hasPushPermission}
      buttonText={getButtonText({
        hasPrompted: status.hasPrompted,
        hasPushPermission: status.hasPushPermission,
      })}
      onPressPrimary={ready ? onPressPrimary : null}
      onPressSecondary={
        // if onPressSecondary exists use it else default onPressPrimary
        !ready ? onPressSecondary || onPressPrimary : null
      }
      pressPrimaryEventName={'Ask Notifications Completed'}
      pressSecondaryEventName={'Ask Notifications Skipped'}
      {...props}
    />
  );
};

// eslint-disable-next-line react/display-name
const AskNotificationsConnected = memo((props) => (
  <NotificationsConsumer>
    {(status) => <AskNotificationsWithStatus {...props} status={status} />}
  </NotificationsConsumer>
));

AskNotificationsWithStatus.propTypes = {
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object, // type check for React fragments
  ]),
  onPressPrimary: PropTypes.func,
  onPressSecondary: PropTypes.func,
  onRequestPushPermissions: PropTypes.func.isRequired,
  getButtonText: PropTypes.func,
  status: PropTypes.shape({
    hasPrompted: PropTypes.bool,
    hasPushPermission: PropTypes.bool,
    checkPermissions: PropTypes.func,
    updatePermissionStatus: PropTypes.func,
    loading: PropTypes.bool,
  }),
};

AskNotificationsWithStatus.defaultProps = {
  Component: AskNotifications,
  getButtonText: defaultGetButtonText,
};

AskNotificationsConnected.displayName = 'AskNotificationsConnected';

export default AskNotificationsConnected;
