import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import CenteredView from '../CenteredView';
import BackgroundView from '../BackgroundView';
import { H3, H4 } from '../typography';

import FollowList from '.';

const followerRequests = [
  {
    id: 'fakeId1',
    request: true,
    firstName: 'Joshua',
    lastName: 'Imel',
    parentChannel: {
      id: 'ContentChannel:be35f49307d7297989d3514be788ef2d',
      name: 'NewSpring - Articles',
    },
    image: {
      sources: [
        {
          uri: 'https://picsum.photos/600/400?random',
        },
      ],
    },
  },
  {
    id: 'fakeId2',
    request: true,
    firstName: 'Joe',
    lastName: 'Schmoe',
    parentChannel: {
      id: 'ContentChannel:be35f49307d7297989d3514be788ef2d',
      name: 'NewSpring - Articles',
    },
    image: {
      sources: [
        {
          uri: 'https://picsum.photos/600/400?random',
        },
      ],
    },
  },
];

const followerSuggestions = [
  {
    id: 'fakeId3',
    firstName: 'John',
    lastName: 'Doe',
    parentChannel: {
      id: 'ContentChannel:be35f49307d7297989d3514be788ef2d',
      name: 'NewSpring - Articles',
    },
    image: {
      sources: [
        {
          uri: 'https://picsum.photos/600/400?random',
        },
      ],
    },
  },
  {
    id: 'fakeId4',
    firstName: 'Billy',
    lastName: 'Bob',
    parentChannel: {
      id: 'ContentChannel:be35f49307d7297989d3514be788ef2d',
      name: 'NewSpring - Articles',
    },
    image: {
      sources: [
        {
          uri: 'https://picsum.photos/600/400?random',
        },
      ],
    },
  },
];

const buttonFuncs = {
  onHide(id) {
    console.log(`hide request for ${id}`);
  },
  onConfirm(id) {
    console.log(`confirm request for ${id}`);
  },
  onFollow(id) {
    console.log(`follow request for ${id}`);
  },
};

storiesOf('FollowList', module)
  .addDecorator((story) => (
    <BackgroundView>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <CenteredView style={{ alignItems: 'stretch' }}>{story()}</CenteredView>
    </BackgroundView>
  ))
  .add('default', () => (
    <>
      <FollowList
        followers={followerRequests}
        {...buttonFuncs}
        header={<H4>Follow Requests</H4>}
      />
      <FollowList
        followers={followerSuggestions}
        {...buttonFuncs}
        header={<H4>Suggested Followers</H4>}
      />
    </>
  ))
  .add('header', () => {
    return (
      <FollowList
        followers={followerRequests}
        header={
          <H4 numberOfLines={1} ellipsizeMode="tail">
            Follow Requests
          </H4>
        }
        {...buttonFuncs}
      />
    );
  })
  .add('onPressActionListButton', () => (
    <FollowList
      followers={followerRequests}
      onPressFollowListButton={() => {}}
      followListButtonTitle="Find People to Follow"
      {...buttonFuncs}
    />
  ))
  .add('isCard (false)', () => (
    <FollowList followers={followerRequests} isCard={false} {...buttonFuncs} />
  ))
  .add('isLoading', () => (
    <FollowList
      isLoading
      followers={followerRequests}
      header={
        <H3 numberOfLines={1} ellipsizeMode="tail">
          Some random text that encourages you
        </H3>
      }
      {...buttonFuncs}
    />
  ));
