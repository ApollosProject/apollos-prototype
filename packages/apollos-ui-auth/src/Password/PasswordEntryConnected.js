/* eslint-disable react/jsx-handler-names */
import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';

import { LoginConsumer } from '../LoginProvider';
import PasswordEntry from './PasswordEntry';

const PasswordEntryConnected = ({
  screenProps,
  navigation,
  route: {
    params: { forgotPasswordURL },
  },
}) => (
  <LoginConsumer>
    {({ handleSubmitLogin, newUser }) => (
      <Formik
        validationSchema={Yup.object().shape({
          password: Yup.string().required('Password is required!'),
        })}
        onSubmit={async ({ password }, { setSubmitting, setFieldError }) => {
          setSubmitting(true);
          try {
            await handleSubmitLogin({ password });
          } catch (e) {
            const { graphQLErrors } = e;
            if (
              graphQLErrors &&
              graphQLErrors.length &&
              graphQLErrors.find(
                ({ extensions }) => extensions.code === 'UNAUTHENTICATED'
              )
            ) {
              setFieldError('password', 'Your email or password is incorrect.');
            } else {
              setFieldError(
                'password',
                'Unknown error. Please try again later.'
              );
            }
          }
          setSubmitting(false);
        }}
      >
        {(formikBag) => (
          <PasswordEntry
            {...screenProps}
            {...formikBag}
            errors={formikBag.touched.password && formikBag.errors}
            isLoading={formikBag.isSubmitting}
            onPressNext={formikBag.handleSubmit}
            onPressBack={navigation.goBack}
            forgotPasswordURL={forgotPasswordURL}
            newUser={newUser}
          />
        )}
      </Formik>
    )}
  </LoginConsumer>
);

PasswordEntryConnected.propTypes = {
  navigation: PropTypes.shape({ goBack: PropTypes.func.isRequired }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({ forgotPasswordURL: PropTypes.string }),
  }),
  emailRequired: PropTypes.bool,
  screenProps: PropTypes.shape({}),
};

PasswordEntryConnected.defaultProps = {
  emailRequired: true,
};

export default PasswordEntryConnected;
