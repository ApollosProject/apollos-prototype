import React from 'react';
import renderer from 'react-test-renderer';

import TestProviders from 'TestProviders';
import { H3, H7, BodyText, Paragraph } from 'ui/typography';
import Button, { ButtonLink } from 'ui/Button';

import Card, { CardImage, CardContent, CardActions } from './';

describe('the Card component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <TestProviders>
        <Card>
          <CardImage source={'https://picsum.photos/600/400/?image=63'} />
          <CardContent>
            <H3>Coffee</H3>
            <H7>noun</H7>
            <Paragraph>
              <BodyText>
                {
                  'A dark substance that turns "leave me alone" into "good morning!"'
                }
              </BodyText>
            </Paragraph>
          </CardContent>
          <CardActions>
            <Button title="Learn More" pill={false} />
            <ButtonLink>Share</ButtonLink>
          </CardActions>
        </Card>
      </TestProviders>
    );
    expect(tree).toMatchSnapshot();
  });
  it('it should render a placeholder', () => {
    const tree = renderer.create(
      <TestProviders>
        <Card isLoading>
          <CardContent>
            <H3 />
            <H7 />
            <Paragraph>
              <BodyText />
            </Paragraph>
          </CardContent>
          <CardActions>
            <Button pill={false} />
            <ButtonLink />
          </CardActions>
        </Card>
      </TestProviders>
    );
    expect(tree).toMatchSnapshot();
  });
});