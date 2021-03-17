import React from 'react';
import { Query } from '@apollo/client/react/components';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import { get } from 'lodash';

import { H3, styled, PaddedView } from '@apollosproject/ui-kit';
import UserAvatarConnected from '../UserAvatarConnected';
import GET_USER_PROFILE from './getUserProfile';

const GetUserProfile = ({ children }) => (
  <Query query={GET_USER_PROFILE}>
    {({ data: { currentUser = {} } = {} }) => {
      const firstName = get(currentUser, 'profile.firstName');
      return children({ firstName });
    }}
  </Query>
);

GetUserProfile.propTypes = {
  children: PropTypes.func.isRequired,
};

const Container = styled({
  alignItems: 'center',
  justifyContent: 'center',
})(PaddedView);

const UserAvatarHeader = ({ buttonIcon, message, size, ...props }) => {
  const navigation = useNavigation();
  return (
    <Container>
      <PaddedView horizontal={false}>
        <UserAvatarConnected
          size={size}
          buttonIcon={buttonIcon}
          onPressIcon={() => navigation.navigate('UserSettings')}
          {...props}
        />
      </PaddedView>
      <GetUserProfile>
        {({ firstName }) => (
          <H3>
            {message}
            {firstName ? ` ${firstName}` : ''}!
          </H3>
        )}
      </GetUserProfile>
    </Container>
  );
};

UserAvatarHeader.propTypes = {
  buttonIcon: PropTypes.string,
  message: PropTypes.string,
  onPressIcon: PropTypes.func,
  size: PropTypes.string,
};

UserAvatarHeader.defaultProps = {
  buttonIcon: 'settings',
  message: 'Hello',
  size: 'large',
};

export default UserAvatarHeader;
