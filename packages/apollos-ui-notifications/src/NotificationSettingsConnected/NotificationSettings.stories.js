import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import NotificationSettings from './NotificationSettings';

storiesOf('user-settings/NotificationSettings', module).add('default', () => (
  <NotificationSettings toggleNotifications={() => true} />
));
