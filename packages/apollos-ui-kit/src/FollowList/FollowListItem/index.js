import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import { H5 } from '../../typography';
import styled from '../../styled';
import { ImageSourceType } from '../../ConnectedImage';
import FlexedView from '../../FlexedView';
import Button from '../../Button';
import H6 from '../../typography/H6';
import FollowListImage from './FollowListImage';

const TextContainer = styled(
  {
    justifyContent: 'center',
  },
  'ui-kit.FollowList.FollowListItem.TextContainer'
)(FlexedView);

const Cell = styled(
  ({ theme }) => ({
    marginBottom: theme.sizing.baseUnit,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  }),
  'ui-kit.FollowList.FollowListItem.Cell'
)(View);

const StyledButton = styled(
  ({ theme }) => ({
    paddingHorizontal: theme.sizing.baseUnit * 0.5,
    height: theme.sizing.baseUnit * 2,
    borderRadius: theme.sizing.baseUnit * 0.5,
    marginLeft: theme.sizing.baseUnit * 0.5,
  }),
  'ui-kit.FollowList.FollowListItem.Button'
)(Button);

const FollowListItem = ({
  imageSource,
  name,
  request,
  requested,
  confirmed,
  onHide,
  onConfirm,
  onFollow,
}) => {
  return (
    <Cell>
      <FollowListImage source={imageSource} />
      <TextContainer>
        {name ? <H5 numberOfLines={1}>{name}</H5> : null}
      </TextContainer>
      {request && !confirmed && (
        <StyledButton pill={false} type="default" onPress={onHide}>
          <H6>Hide</H6>
        </StyledButton>
      )}
      {request && (
        <StyledButton
          disabled={confirmed}
          pill={false}
          type="primary"
          onPress={onConfirm}
        >
          <H6>{confirmed ? 'Confirmed!' : 'Confirm'}</H6>
        </StyledButton>
      )}
      {!request && (
        <StyledButton
          disabled={requested}
          pill={false}
          type="primary"
          onPress={onFollow}
        >
          <H6>{requested ? 'Requested' : 'Follow'}</H6>
        </StyledButton>
      )}
    </Cell>
  );
};

FollowListItem.propTypes = {
  imageSource: ImageSourceType.isRequired,
  name: PropTypes.string,
  request: PropTypes.bool,
  requested: PropTypes.bool,
  confirmed: PropTypes.bool,
  onHide: PropTypes.func,
  onConfirm: PropTypes.func,
  onFollow: PropTypes.func,
};

export default FollowListItem;
