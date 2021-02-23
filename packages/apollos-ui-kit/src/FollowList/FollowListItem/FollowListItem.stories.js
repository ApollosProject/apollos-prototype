import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import CenteredView from '../../CenteredView';
import PaddedView from '../../PaddedView';
import BackgroundView from '../../BackgroundView';

import FollowListItem from '.';

const name = 'Joe Schmoe';

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

storiesOf('FollowList/FollowListItem', module)
  .addDecorator((story) => (
    <BackgroundView>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <CenteredView style={{ alignItems: 'stretch' }}>
        <PaddedView>{story()}</PaddedView>
      </CenteredView>
    </BackgroundView>
  ))
  .add('default', () => (
    <FollowListItem
      imageSource={'https://picsum.photos/600/400/?random'}
      name={name}
      {...buttonFuncs}
    />
  ))
  .add('renders without image src', () => (
    <FollowListItem name={name} {...buttonFuncs} />
  ))
  .add('renders without name', () => (
    <FollowListItem
      imageSource={'https://picsum.photos/600/400/?random'}
      {...buttonFuncs}
    />
  ))
  .add('follower request', () => (
    <FollowListItem
      imageSource={'https://picsum.photos/600/400/?random'}
      name={name}
      request
      {...buttonFuncs}
    />
  ))
  .add('follower suggestion', () => (
    <FollowListItem
      imageSource={'https://picsum.photos/600/400/random'}
      name={name}
      {...buttonFuncs}
    />
  ))
  .add('follower confirmed', () => (
    <FollowListItem
      imageSource={'https://picsum.photos/600/400/?random'}
      name={name}
      request
      confirmed
      {...buttonFuncs}
    />
  ))
  .add('follower requested', () => (
    <FollowListItem
      imageSource={'https://picsum.photos/600/400/?random'}
      name={name}
      requested
      {...buttonFuncs}
    />
  ));
