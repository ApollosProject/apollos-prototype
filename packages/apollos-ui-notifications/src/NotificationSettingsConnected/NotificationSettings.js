import React from 'react';
import PropTypes from 'prop-types';
import { Switch } from '@apollosproject/ui-kit';
import { Formik } from 'formik';

const onChange = (newState, toggleNotifications) => {
  toggleNotifications();
  return newState;
};

const NotificationSettings = ({
  notificationsEnabled,
  toggleNotifications,
}) => (
  <Formik initialValues={{ enabled: notificationsEnabled }}>
    {({ handleChange, values }) => (
      <Switch
        value={values.enabled}
        label={'allNotifications'}
        onValueChange={onChange(handleChange('enabled'), toggleNotifications)}
      />
    )}
  </Formik>
);

NotificationSettings.propTypes = {
  notificationsEnabled: PropTypes.bool,
  toggleNotifications: PropTypes.func,
};

NotificationSettings.defaultProps = {
  notificationsEnabled: false,
  toggleNotifications: () => {},
};

NotificationSettings.displayName = 'NotificationSettings';

export default NotificationSettings;
