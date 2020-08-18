import React, { PureComponent } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import {
  H2,
  H5,
  HorizontalTileFeed,
  PaddedView,
  styled,
  TouchableScale,
  withIsLoading,
} from '@apollosproject/ui-kit';

import { horizontalContentCardComponentMapper, LiveConsumer } from '../..';

const Title = styled(
  ({ theme }) => ({
    color: theme.colors.text.tertiary,
  }),
  'ui-connected.HorizontalCardListFeatureConnected.HorizontalCardListFeature.Title'
)(H5);

const Subtitle = styled(
  {},
  'ui-connected.HorizontalCardListFeatureConnected.HorizontalCardListFeature.Subtitle'
)(H2);

const Header = styled(
  ({ theme }) => ({
    paddingTop: theme.sizing.baseUnit * 3,
    paddingBottom: theme.sizing.baseUnit * 0.5,
  }),
  'ui-connected.HorizontalCardListFeatureConnected.HorizontalCardListFeature.Header'
)(PaddedView);

class HorizontalCardListFeature extends PureComponent {
  static defaultProps = {
    loadingStateObject: {
      id: 'fakeId0',
      isLoading: true,
      title: 'Boom',
      hasAction: true,
      actionIcon: 'umbrella',
      channelType: '',
      coverImage: [],
      // We need to assume a typename so horizontalContentCardComponentMapper knows what "type" to render
      __typename: 'MediaContentItem',
    },
  };

  static propTypes = {
    cards: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    isLoading: PropTypes.bool,
    listKey: PropTypes.string, // needed if multiple lists/feeds are displayed as siblings
    loadingStateObject: PropTypes.shape({}),
    onPressItem: PropTypes.func,
    subtitle: PropTypes.string,
    title: PropTypes.string,
  };

  keyExtractor = (item) => item && item.id;

  renderItem = ({ item }) => (
    <LiveConsumer contentId={item.id}>
      {(liveStream) => {
        const isLive = !!(liveStream && liveStream.isLive);
        const labelText = isLive ? 'Live' : item.labelText;
        return (
          <TouchableScale onPress={() => this.props.onPressItem(item)}>
            {horizontalContentCardComponentMapper({
              isLive,
              ...item,
              labelText,
            })}
          </TouchableScale>
        );
      }}
    </LiveConsumer>
  );

  render() {
    const {
      isLoading,
      cards,
      subtitle,
      title,
      listKey,
      loadingStateObject,
    } = this.props;
    return (
      !!(isLoading || cards.length) && (
        <View>
          {isLoading || title || subtitle ? ( // only display the Header if we are loading or have a title/subtitle
            <Header vertical={false}>
              {isLoading || title ? ( // we check for isloading here so that they are included in the loading state
                <Title numberOfLines={1}>{title}</Title>
              ) : null}
              {isLoading || this.props.subtitle ? (
                <Subtitle>{this.props.subtitle}</Subtitle>
              ) : null}
            </Header>
          ) : null}
          <HorizontalTileFeed
            content={cards}
            isLoading={isLoading}
            listKey={listKey}
            keyExtractor={this.keyExtractor}
            loadingStateObject={loadingStateObject}
            renderItem={this.renderItem}
          />
        </View>
      )
    );
  }
}

export default withIsLoading(HorizontalCardListFeature);
