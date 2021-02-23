import React from 'react';
import renderer from 'react-test-renderer';

import Providers from '../../Providers';
import { withIsLoading } from '../../isLoading';

import FollowListItem from '.';

describe('FollowListItem', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <FollowListItem imageSource={'https://picsum.photos/600/400/?random'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a name', () => {
    const tree = renderer.create(
      <Providers>
        <FollowListItem
          imageSource={'https://picsum.photos/600/400/?random'}
          name={'Joe Schmoe'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a follower request', () => {
    const tree = renderer.create(
      <Providers>
        <FollowListItem
          imageSource={'https://picsum.photos/600/400/?random'}
          request
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a follower suggestion', () => {
    const tree = renderer.create(
      <Providers>
        <FollowListItem imageSource={'https://picsum.photos/600/400/?random'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a loading state', () => {
    const SetIsLoading = withIsLoading(({ children }) => children);
    const tree = renderer.create(
      <Providers>
        <SetIsLoading isLoading>
          <FollowListItem
            imageSource="https://picsum.photos/600/400/?random"
            name={'Joe Schmoe'}
          />
        </SetIsLoading>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
