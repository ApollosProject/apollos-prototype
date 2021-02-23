import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, Platform } from 'react-native';
import { get } from 'lodash';
import {
  PaddedView,
  TextInput,
  Button,
  ButtonLink,
  BackgroundView,
} from '@apollosproject/ui-kit';
import { RockAuthedWebBrowser } from '@apollosproject/ui-connected';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  FlexedSafeAreaView,
  TitleText,
  PromptText,
  FlexedKeyboardAvoidingView,
} from '../styles';

const PasswordEntry = ({
  passwordTitleText,
  passwordPromptText,
  passwordPromptTextNewUser,
  forgotPasswordURL,
  disabled,
  errors,
  isLoading,
  onPressNext,
  setFieldValue,
  values,
  BackgroundComponent,
  newUser,
}) => {
  // We need to  the avoiding view by by header height on iOS so the button doesn't appear under the keyboard.
  // https://github.com/software-mansion/react-native-screens/blob/bcd5e4d8ea861b78bff7747162e6df7163ed4e1f/createNativeStackNavigator/README.md
  const statusBarInset = useSafeAreaInsets().top; // inset of the status bar
  const headerInset = statusBarInset + 44; // inset to use for a small header since it's frame is equal to 44 + the frame of status bar
  return (
    <RockAuthedWebBrowser>
      {(openUrl) => (
        <BackgroundComponent>
          <FlexedSafeAreaView edges={['right', 'top', 'left']}>
            <FlexedKeyboardAvoidingView
              behavior={'padding'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? headerInset : 0}
            >
              <ScrollView>
                <PaddedView>
                  <TitleText>{passwordTitleText}</TitleText>
                  <PromptText padded>
                    {newUser ? passwordPromptTextNewUser : passwordPromptText}
                  </PromptText>

                  <TextInput
                    autoFocus
                    autoComplete={'password'}
                    label={'Password'}
                    type={'password'}
                    textContentType="password"
                    enablesReturnKeyAutomatically
                    returnKeyType={'next'}
                    onSubmitEditing={onPressNext}
                    error={get(errors, 'password')}
                    onChangeText={(text) => setFieldValue('password', text)}
                    value={get(values, 'password')}
                  />

                  {forgotPasswordURL ? (
                    <ButtonLink onPress={() => openUrl(forgotPasswordURL)}>
                      Forgot your password?
                    </ButtonLink>
                  ) : null}
                </PaddedView>
              </ScrollView>

              {onPressNext ? (
                <PaddedView>
                  <Button
                    onPress={onPressNext}
                    disabled={disabled}
                    loading={isLoading}
                    title={'Login'}
                    type={'primary'}
                    pill={false}
                  />
                </PaddedView>
              ) : null}
            </FlexedKeyboardAvoidingView>
          </FlexedSafeAreaView>
        </BackgroundComponent>
      )}
    </RockAuthedWebBrowser>
  );
};

PasswordEntry.propTypes = {
  passwordTitleText: PropTypes.string,
  passwordPromptText: PropTypes.string,
  passwordPromptTextNewUser: PropTypes.string,
  disabled: PropTypes.bool,
  forgotPasswordURL: PropTypes.string,
  errors: PropTypes.shape({
    password: PropTypes.string,
  }),
  isLoading: PropTypes.bool,
  onPressNext: PropTypes.func, // used to navigate and/or submit the form
  setFieldValue: PropTypes.func.isRequired,
  values: PropTypes.shape({
    password: PropTypes.string,
  }),
  BackgroundComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  newUser: PropTypes.bool,
};

PasswordEntry.defaultProps = {
  passwordTitleText: 'Now for your password',
  passwordPromptText: 'Enter your password to continue.',
  passwordPromptTextNewUser: 'Create a new password to continue.',
  BackgroundComponent: BackgroundView,
};

PasswordEntry.displayName = 'PasswordEntry';

export default PasswordEntry;
