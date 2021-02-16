import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { withTheme } from '@apollosproject/ui-kit';
import PropTypes from 'prop-types';
import hoistNonReactStatic from 'hoist-non-react-statics';

import {
  SMSPhoneEntryConnected as AuthSMSPhoneEntryConnected,
  SMSVerification as AuthSMSVerification,
  SMSVerificationConnected as AuthSMSVerificationConnected,
} from './SMS';
import {
  EmailEntryConnected as AuthEmailEntryConnected,
  PasswordEntry as AuthPasswordEntry,
  PasswordEntryConnected as AuthPasswordEntryConnected,
} from './Password';
import {
  ProfileEntry as AuthProfileEntry,
  ProfileEntryConnected as AuthProfileEntryConnected,
} from './Profile';
import {
  ProfileDetailsEntry as AuthProfileDetailsEntry,
  ProfileDetailsEntryConnected as AuthProfileDetailsEntryConnected,
} from './ProfileDetails';

export LoginButton from './LoginButton';
export ProtectedAction from './ProtectedAction';
export ProtectedTouchable from './ProtectedTouchable';
export AuthProvider, { AuthConsumer } from './Provider';
export ProtectedRoute from './ProtectedRoute';

export {
  AUTHENTICATE,
  HANDLE_LOGIN,
  LOGOUT,
  REGISTER_WITH_SMS,
  REGISTER_WITH_EMAIL,
  REQUEST_SMS_PIN,
  VERIFY_PIN,
} from './mutations';
export { GET_LOGIN_STATE, GET_USER_EXISTS } from './queries';
export authLink from './authLink';
export buildErrorLink from './buildErrorLink';
export Entry from './Entry';
export * from './LoginProvider';

export {
  AuthSMSPhoneEntryConnected,
  AuthSMSVerification,
  AuthSMSVerificationConnected,
  AuthEmailEntryConnected,
  AuthPasswordEntry,
  AuthPasswordEntryConnected,
  AuthProfileEntry,
  AuthProfileEntryConnected,
  AuthProfileDetailsEntry,
  AuthProfileDetailsEntryConnected,
};

const AuthStack = createNativeStackNavigator();
const IdentityStack = createNativeStackNavigator();

const AuthNavigator = ({ forgotPasswordURL, ...props }) => (
  <AuthStack.Navigator
    initialRouteName="AuthIdentity"
    headerMode="none"
    {...props}
  >
    <AuthStack.Screen name="Identity">
      {() => (
        <IdentityStack.Navigator
          screenOptions={{ stackAnimation: 'none', headerShown: false }}
        >
          <IdentityStack.Screen
            name="AuthSMSPhoneEntryConnected"
            component={AuthSMSPhoneEntryConnected}
          />
          <IdentityStack.Screen
            name="AuthEmailEntryConnected"
            component={AuthEmailEntryConnected}
          />
        </IdentityStack.Navigator>
      )}
    </AuthStack.Screen>
    <AuthStack.Screen
      name="AuthSMSVerificationConnected"
      options={{ headerShown: true }}
      component={AuthSMSVerificationConnected}
    />
    <AuthStack.Screen
      name="AuthPasswordEntryConnected"
      options={{ headerShown: true }}
      component={AuthPasswordEntryConnected}
      initialParams={{ forgotPasswordURL }}
    />
    <AuthStack.Screen
      name="AuthProfileEntryConnected"
      component={AuthProfileEntryConnected}
    />
    <AuthStack.Screen
      name="AuthProfileDetailsEntryConnected"
      component={AuthProfileDetailsEntryConnected}
    />

    {/* Redirects */}
    <AuthStack.Screen name="AuthSMSPhoneEntryConnected">
      {({ navigation }) =>
        navigation.replace('Identity', {
          screen: 'AuthSMSPhoneEntryConnected',
        }) || null
      }
    </AuthStack.Screen>
    <AuthStack.Screen name="AuthEmailEntryConnected">
      {({ navigation }) =>
        navigation.replace('Identity', {
          screen: 'AuthEmailEntryConnected',
        }) || null
      }
    </AuthStack.Screen>
  </AuthStack.Navigator>
);

const ThemedAuthNavigator = withTheme(({ theme, ...props }) => ({
  ...props,
  screenOptions: {
    headerTintColor: theme.colors.action.secondary,
    headerTitleStyle: {
      color: theme.colors.text.primary,
    },
    headerStyle: {
      backgroundColor: theme.colors.background.paper,
    },
    headerHideShadow: true,
    headerTitle: '',
    headerBackTitle: 'Back',
    headerShown: false,
  },
}))(AuthNavigator);

AuthNavigator.propTypes = {
  alternateLoginText: PropTypes.node,
  authTitleText: PropTypes.string,
  confirmationTitleText: PropTypes.string,
  confirmationPromptText: PropTypes.string,
  onFinishAuth: PropTypes.func,
  passwordPromptText: PropTypes.string,
  smsPolicyInfo: PropTypes.node,
  smsPromptText: PropTypes.string,
  emailRequired: PropTypes.bool,
  forgotPasswordURL: PropTypes.string,
};

const Auth = (props) => <ThemedAuthNavigator {...props} />;
hoistNonReactStatic(Auth, AuthNavigator);

export default Auth;
