import React from 'react';
import renderer from 'react-test-renderer';

import { Providers } from '@apollosproject/ui-test-utils';

import PasswordEntryConnected from './PasswordEntryConnected';

describe('ui-auth/Password/PasswordEntryConnected', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <PasswordEntryConnected
          handleForgotPassword={jest.fn()}
          navigation={{ navigate: () => null }}
          route={{ params: { forgotPasswordURL: 'forgotpassword.com' } }}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
