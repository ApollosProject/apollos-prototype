import React from 'react';
import renderer from 'react-test-renderer';

import Providers from '../../Providers';

import H3 from '.';

describe('the H3 component', () => {
  it('should render correctly', () => {
    const tree = renderer.create(
      <Providers>
        <H3>Default H3 text</H3>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should accept and render passed in styles', () => {
    const salmon = { color: 'salmon' };
    const tree = renderer.create(
      <Providers>
        <H3 style={salmon}>Salmon text</H3>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with correct padding', () => {
    const tree = renderer.create(
      <Providers>
        <H3 padded>Padded H3 text</H3>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a loading state', () => {
    const tree = renderer.create(
      <Providers>
        <H3 isLoading>Default H3 text</H3>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a loading state with correct positioning (margins)', () => {
    const tree = renderer.create(
      <Providers>
        <H3 padded isLoading>
          Padded H3 text
        </H3>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should accept additional props', () => {
    const tree = renderer.create(
      <Providers>
        <H3 accessible={false}>
          {
            '"The Christian shoemaker does his duty not by putting little crosses on the shoes, but by making good shoes, because God is interested in good craftsmanship." ― Martin Luther'
          }
        </H3>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
