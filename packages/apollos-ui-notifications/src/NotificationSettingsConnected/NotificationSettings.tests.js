import React from 'react';
import renderer from 'react-test-renderer';

import { Providers } from '@apollosproject/ui-kit';

import NotificationSettings from './NotificationSettings';

describe('The NotificationSettings toggle switch', () => {
  it('should render correctly', () => {
    const tree = renderer.create(
      <Providers>
        <NotificationSettings />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
