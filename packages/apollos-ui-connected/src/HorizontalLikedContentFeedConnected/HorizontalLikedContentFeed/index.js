import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import {
  styled,
  withTheme,
  PaddedView,
  H5,
  H6,
  HorizontalTileFeed,
  ButtonLink,
  TouchableScale,
  Touchable,
  withIsLoading,
} from '@apollosproject/ui-kit';

import HorizontalContentCardConnected from '../../HorizontalContentCardConnected';

const RowHeader = styled(
  ({ theme }) => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2, // UX hack to improve tapability. Positions RowHeader above StyledHorizontalTileFeed
    paddingTop: theme.sizing.baseUnit * 0.5,
    paddingLeft: theme.sizing.baseUnit,
  }),
  'ui-connected.HorizontalLikedContentFeedConnected.HorizontalLikedContentFeed.RowHeader'
)(View);

const Name = styled(
  {
    flexGrow: 2,
  },
  'ui-connected.HorizontalLikedContentFeedConnected.HorizontalLikedContentFeed.Name'
)(View);

const ButtonLinkSpacing = styled(
  ({ theme }) => ({
    flexDirection: 'row', // correctly positions the loading state
    justifyContent: 'flex-end', // correctly positions the loading state
    padding: theme.sizing.baseUnit, // UX hack to improve tapability.
  }),
  'ui-connected.HorizontalLikedContentFeedConnected.HorizontalLikedContentFeed.ButtonLinkSpacing'
)(View);

const AndroidTouchableFix = withTheme(
  ({ theme }) => ({
    borderRadius: theme.sizing.baseBorderRadius / 2,
  }),
  'ui-connected.HorizontalLikedContentFeedConnected.HorizontalLikedContentFeed.AndroidTouchableFix'
)(Touchable);

const StyledHorizontalTileFeed = styled(
  ({ theme }) => ({
    /* UX hack to improve tapability. The magic number below happens to be the number of pixels that
     * aligns everything in the same place as if none of the UX hacks were there. */
    marginTop: theme.sizing.baseUnit * -1.25,
    zIndex: 1,
  }),
  'ui-connected.HorizontalLikedContentFeedConnected.HorizontalLikedContentFeed.StyledHorizontalTileFeed'
)(HorizontalTileFeed);

class HorizontalLikedContentFeed extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
      push: PropTypes.func,
    }),
    isLoading: PropTypes.bool,
    name: PropTypes.string,
    content: PropTypes.arrayOf(
      PropTypes.any // this component doesn't care about the shape of `node`, just that it exists
    ),
    Component: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.func,
      PropTypes.object,
    ]),
  };

  static defaultProps = {
    Component: HorizontalContentCardConnected,
  };

  loadingStateObject = {
    id: 'fake_id',
    title: '',
    coverImage: [],
  };

  titleImageItem = ({ item }) => {
    const { Component: TileComponent } = this.props;
    return (
      <TouchableScale
        onPress={() => {
          this.props.navigation.push('ContentSingle', {
            itemId: item.id,
          });
        }}
      >
        <TileComponent isLoading={item.isLoading} contentId={item.id} />
      </TouchableScale>
    );
  };

  render() {
    const { isLoading, name, navigation, content = [] } = this.props;
    return (
      <PaddedView horizontal={false}>
        <RowHeader>
          <Name>
            <H5>{name}</H5>
          </Name>

          <AndroidTouchableFix
            onPress={() => {
              navigation.navigate('LikedContentFeedConnected');
            }}
          >
            <ButtonLinkSpacing>
              <H6>
                {/* we have to wrap "View All" in a ButtonLink twice to inherit styles and color correctly. */}
                <ButtonLink>View All</ButtonLink>
              </H6>
            </ButtonLinkSpacing>
          </AndroidTouchableFix>
        </RowHeader>
        <StyledHorizontalTileFeed
          content={content}
          renderItem={this.titleImageItem}
          loadingStateObject={this.loadingStateObject}
          isLoading={isLoading}
        />
      </PaddedView>
    );
  }
}

export default withIsLoading(HorizontalLikedContentFeed);
