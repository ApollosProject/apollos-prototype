import React, { useState } from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import NotificationSettings from './NotificationSettings';

const DummyNotificationsSettings = () => {
  const [permissions, setPermissions] = useState(false);
  return (
    <NotificationSettings
      allNotificationsEnabled={permissions}
      toggleNotifications={() => setPermissions(!permissions)}
    />
  );
};

storiesOf('user-settings/NotificationSettings', module).add('default', () => (
  <DummyNotificationsSettings />
));
