import React from 'react';
import PropTypes from 'prop-types';
import { Switch } from '@apollosproject/ui-kit';
import { Formik } from 'formik';

const NotificationSettings = ({
  allNotificationsEnabled,
  toggleNotifications,
}) => (
  <Formik initialValues={{ allNotifications: allNotificationsEnabled }}>
    {({ setFieldValue, values }) => (
      <Switch
        value={values.allNotifications}
        label={'Notifications'}
        onValueChange={async () =>
          (await toggleNotifications()) &&
          setFieldValue('allNotifications', !values.allNotifications)
        }
      />
    )}
  </Formik>
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
