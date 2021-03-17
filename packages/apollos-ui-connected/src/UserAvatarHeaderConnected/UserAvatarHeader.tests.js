import React from 'react';
import {
  Providers,
  renderWithApolloData,
  WithReactNavigator,
} from '@apollosproject/ui-test-utils';
import { MockedProvider } from '@apollo/client/testing';

import GET_USER_PHOTO from '../UserAvatarConnected/getUserPhoto';
import GET_USER_PROFILE from './getUserProfile';

import UserAvatarHeaderConnected from '.';

describe('UserAvatarHeaderConnected component', () => {
  it('renders UserAvatarHeaderConnected', async () => {
    const mocks = [
      {
        request: {
          query: GET_USER_PHOTO,
        },
        result: {
          data: {
            currentUser: {
              __typename: 'AuthenticatedUser',
              id: 'AuthenticatedUser:123',
              profile: {
                __typename: 'Person',
                id: 'Person:123',
                photo: {
                  uri:
                    'https://res.cloudinary.com/apollos/image/fetch/c_limit,f_auto,w_1600/https://apollosrock.newspring.cc/GetImage.ashx%3Fguid%3D31af1a61-360c-4b1e-8e62-45517c06a9a2',
                  __typename: 'ImageMedia',
                },
              },
            },
          },
        },
      },
      {
        request: {
          query: GET_USER_PROFILE,
        },
        result: {
          data: {
            currentUser: {
              __typename: 'AuthenticatedUser',
              id: 'AuthenticatedUser:123',
              profile: {
                __typename: 'Person',
                id: 'Person:123',
                firstName: 'Vincent',
                lastName: 'Wilson',
                email: 'vince@di.com',
                nickName: 'Vincent Wilson',
                gender: 'MALE',
                birthDate: null,
                photo: {
                  uri:
                    'https://res.cloudinary.com/apollos/image/fetch/c_limit,f_auto,w_1600/https://apollosrock.newspring.cc/GetImage.ashx%3Fguid%3D31af1a61-360c-4b1e-8e62-45517c06a9a2',
                  __typename: 'ImageMedia',
                },
                campus: {
                  __typename: 'Campus',
                  id: 'Campus:123',
                  name: 'Main Campus',
                  latitude: null,
                  longitude: null,
                  street1: null,
                  street2: null,
                  city: null,
                  state: null,
                  postalCode: null,
                  image: null,
                },
              },
            },
          },
        },
      },
    ];
    const tree = await renderWithApolloData(
      WithReactNavigator(
        <Providers MockedProvider={MockedProvider} mocks={mocks}>
          <UserAvatarHeaderConnected />
        </Providers>
      )
    );
    expect(tree).toMatchSnapshot();
  });
});
