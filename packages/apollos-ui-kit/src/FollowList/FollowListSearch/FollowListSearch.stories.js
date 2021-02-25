import React, { useState } from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';
import { View, Button, SafeAreaView } from 'react-native';

import CenteredView from '../../CenteredView';
import BackgroundView from '../../BackgroundView';

import styled from '../../styled';
import FollowListSearchModal from './FollowListSearchModal';
import FollowListSearch from '.';

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

const Container = styled({
  height: '100%',
})(SafeAreaView);

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

function FollowListSearchStory() {
  const [followers, setFollowers] = useState([]);

  return (
    <Container>
      <FollowListSearch
        onSearch={(value) =>
          setFollowers(
            [...followerSuggestions, ...followerRequests].filter((follower) =>
              `${follower.firstName.toLowerCase()} ${follower.lastName.toLowerCase()}`.includes(
                value.toLowerCase()
              )
            )
          )
        }
        results={followers}
        {...buttonFuncs}
      />
    </Container>
  );
}

function FollowListSearchModalStory() {
  const [open, setModalOpen] = useState(false);
  const [followers, setFollowers] = useState([]);

  return (
    <View>
      <Button onPress={() => setModalOpen(true)} title="Open" />
      <FollowListSearchModal
        open={open}
        setModalOpen={setModalOpen}
        onSearch={(value) =>
          setFollowers(
            [...followerSuggestions, ...followerRequests].filter((follower) =>
              `${follower.firstName.toLowerCase()} ${follower.lastName.toLowerCase()}`.includes(
                value.toLowerCase()
              )
            )
          )
        }
        results={followers}
        {...buttonFuncs}
      />
    </View>
  );
}

storiesOf('FollowListSearch', module)
  .addDecorator((story) => (
    <BackgroundView>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <CenteredView style={{ alignItems: 'stretch' }}>{story()}</CenteredView>
    </BackgroundView>
  ))
  .add('default', () => {
    return <FollowListSearchStory />;
  })
  .add('has modal variation', () => {
    return <FollowListSearchModalStory />;
  });
