import React from 'react';
import PropTypes from 'prop-types';
import { Switch, PaddedView } from '@apollosproject/ui-kit';

const NotificationSettings = ({
  allNotificationsEnabled,
  toggleNotifications,
}) => (
  <PaddedView>
    <Switch
      value={allNotificationsEnabled}
      label={'Notifications'}
      onValueChange={() => {
        toggleNotifications();
      }}
    />
  </PaddedView>
);

NotificationSettings.propTypes = {
  allNotificationsEnabled: PropTypes.bool,
  toggleNotifications: PropTypes.func,
};

NotificationSettings.defaultProps = {
  allNotificationsEnabled: false,
  toggleNotifications: () => null,
};

NotificationSettings.displayName = 'NotificationSettings';

export default NotificationSettings;
