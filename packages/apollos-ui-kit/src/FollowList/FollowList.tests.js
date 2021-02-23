import React from 'react';
import renderer from 'react-test-renderer';

import Providers from '../Providers';
import { H4 } from '../typography';

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

describe('FollowList', () => {
  it('should render 4 items', () => {
    const tree = renderer.create(
      <Providers>
        <FollowList followers={[...followerRequests, ...followerSuggestions]} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render as a card', () => {
    const tree = renderer.create(
      <Providers>
        <FollowList followers={followerRequests} isCard />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a header', () => {
    const tree = renderer.create(
      <Providers>
        <FollowList
          followers={followerRequests}
          header={<H4>Follow Requests</H4>}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render items with Follow button', () => {
    const tree = renderer.create(
      <Providers>
        <FollowList followers={followerSuggestions} onFollow={jest.fn()} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render items with Hide and Confirm buttons', () => {
    const tree = renderer.create(
      <Providers>
        <FollowList
          followers={followerRequests}
          onHide={jest.fn()}
          onConfirm={jest.fn()}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with onPressFollowListButton', () => {
    const tree = renderer.create(
      <Providers>
        <FollowList
          followers={followerRequests}
          followListButtonTitle="Press Me!"
          onPressFollowListButton={jest.fn()}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a loading state', () => {
    const tree = renderer.create(
      <Providers>
        <FollowList isLoading followers={followerRequests} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
