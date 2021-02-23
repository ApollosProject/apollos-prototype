import React from 'react';
import renderer from 'react-test-renderer';

import { Providers } from '@apollosproject/ui-test-utils';

import { LikeIcon } from '.';

describe('the LikeButton component', () => {
  it('should render a Like', () => {
    const tree = renderer.create(
      <Providers>
        <LikeIcon itemId={'abc'} isLiked={false} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });

  it('should render a UnLike', () => {
    const tree = renderer.create(
      <Providers>
        <LikeIcon itemId={'abc'} isLiked />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
