import React, { PureComponent } from 'react';
import { ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { Query, Mutation } from 'react-apollo';
import { getVersion, getBuildNumber } from 'react-native-device-info';

import {
  BackgroundView,
  TableView,
  Cell,
  CellIcon,
  CellText,
  Divider,
  Touchable,
  ActivityIndicator,
} from '@apollosproject/ui-kit';

import { GET_LOGIN_STATE, LOGOUT } from '@apollosproject/ui-auth';
import { RockAuthedWebBrowser } from '@apollosproject/ui-connected';
import NavigationService from '../NavigationService';

import ChangeAvatar from './ChangeAvatar';

class UserSettings extends PureComponent {
  static navigationOptions = () => ({
    title: 'Settings',
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }),
  };

  render() {
    return (
      <Query query={GET_LOGIN_STATE} fetchPolicy="cache-and-network">
        {({ data: { isLoggedIn = false, loading } }) => {
          if (loading) return <ActivityIndicator />;
          if (!isLoggedIn) return null;
          return (
            <BackgroundView>
              <ScrollView>
                <ChangeAvatar />

                <RockAuthedWebBrowser>
                  {(openUrl) => (
                    <>
                      <TableView>
                        <Touchable
                          onPress={async () => {
                            await this.props.navigation.navigate(
                              'PersonalDetails'
                            );
                          }}
                        >
                          <Cell>
                            <CellText>Personal Details</CellText>
                            <CellIcon name="arrow-next" />
                          </Cell>
                        </Touchable>
                        <Divider />
                        <Touchable
                          onPress={async () => {
                            await this.props.navigation.navigate('Location');
                          }}
                        >
                          <Cell>
                            <CellText>Location</CellText>
                            <CellIcon name="arrow-next" />
                          </Cell>
                        </Touchable>
                        <Divider />
                        <Touchable
                          onPress={async () => {
                            await this.props.navigation.navigate(
                              'ChangePassword'
                            );
                          }}
                        >
                          <Cell>
                            <CellText>Change Password</CellText>
                            <CellIcon name="arrow-next" />
                          </Cell>
                        </Touchable>
                      </TableView>
                      <TableView>
                        <Touchable
                          onPress={() =>
                            openUrl('https://apollosrock.newspring.cc/')
                          }
                        >
                          <Cell>
                            <CellText>Give Feedback</CellText>
                            <CellIcon name="arrow-next" />
                          </Cell>
                        </Touchable>
                      </TableView>
                      <TableView>
                        <Touchable
                          onPress={() =>
                            openUrl('https://apollosrock.newspring.cc/')
                          }
                        >
                          <Cell>
                            <CellText>Privacy Policy</CellText>
                            <CellIcon name="arrow-next" />
                          </Cell>
                        </Touchable>
                        <Divider />
                        <Touchable
                          onPress={() =>
                            openUrl('https://apollosrock.newspring.cc/')
                          }
                        >
                          <Cell>
                            <CellText>Terms of Use</CellText>
                            <CellIcon name="arrow-next" />
                          </Cell>
                        </Touchable>
                      </TableView>
                      <TableView>
                        <Mutation mutation={LOGOUT}>
                          {(handleLogout) => (
                            <Touchable
                              onPress={async () => {
                                await handleLogout();
                                // This resets the navigation stack, and the navigates to the first auth screen.
                                // This ensures that user isn't navigated to a subscreen of Auth, like the pin entry screen.
                                await NavigationService.resetToAuth();
                              }}
                            >
                              <Cell>
                                <CellText>Logout</CellText>
                                <CellIcon name="arrow-next" />
                              </Cell>
                            </Touchable>
                          )}
                        </Mutation>
                      </TableView>
                      <TableView>
                        <Cell>
                          <CellText>
                            {`App Version: ${getVersion()}.${getBuildNumber()}`}
                          </CellText>
                        </Cell>
                      </TableView>
                    </>
                  )}
                </RockAuthedWebBrowser>
              </ScrollView>
            </BackgroundView>
          );
        }}
      </Query>
    );
  }
}

export default UserSettings;
