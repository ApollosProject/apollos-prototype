import React from 'react';
import renderer from 'react-test-renderer';

import Providers from '../../Providers';

import FollowListSearchModal from './FollowListSearchModal';
import FollowListSearch from '.';

describe('FollowListSearch', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <FollowListSearch />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a search function', () => {
    const tree = renderer.create(
      <Providers>
        <FollowListSearch onSearch={() => {}} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render followers', () => {
    const tree = renderer.create(
      <Providers>
        <FollowListSearch
          results={[{ firstName: 'Joe', lastName: 'Schmoe' }]}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a modal', () => {
    const tree = renderer.create(
      <Providers>
        <FollowListSearchModal />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
