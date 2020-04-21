import React from 'react';
import renderer from 'react-test-renderer';

import { Providers, renderWithApolloData } from '../utils/testUtils';

import GET_ACTION_LIST_FEATURE from './getActionListFeature';
import ActionListFeatureConnected from './index';

const mock = {
  request: {
    query: GET_ACTION_LIST_FEATURE,
    variables: { featureId: 'ActionListFeature:123' },
  },
  result: {
    data: {
      node: {
        id: 'ActionListFeature:123',
        __typename: 'ActionListFeature',
        title: 'Some cool list',
        subtitle: 'Check it out',
        actions: [
          {
            __typename: 'ActionListFeatureAction',
            id: 'ActionListFeatureAction',
            title: 'Boom',
            subtitle: 'What',
            action: 'READ_CONTENT',
            image: {
              __typename: 'ImageMedia',
              sources: [
                {
                  __typename: 'ImageMediaSource',
                  uri: 'https://picsum.photos/200/200',
                },
              ],
            },
            relatedNode: {
              __typename: 'UniversalContentItem',
              id: 'UniversalContentItem:123',
            },
          },
        ],
      },
    },
  },
};

describe('The ActionListFeatureConnected component', () => {
  it('should render', async () => {
    const tree = await renderWithApolloData(
      <Providers mocks={[mock]}>
        <ActionListFeatureConnected featureId={'ActionListFeature:123'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a loading state when isLoading', async () => {
    const tree = renderer.create(
      <Providers>
        <ActionListFeatureConnected featureId={'ActionListFeature:123'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
