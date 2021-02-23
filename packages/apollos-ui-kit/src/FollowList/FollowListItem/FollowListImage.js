import React from 'react';
import PropTypes from 'prop-types';
import styled from '../../styled';
import ConnectedImage, { ImageSourceType } from '../../ConnectedImage';
import { withIsLoading } from '../../isLoading';

const CellImage = styled(
  ({ theme }) => ({
    width: theme.sizing.baseUnit * 4,
    height: theme.sizing.baseUnit * 4,
    borderRadius: theme.sizing.baseUnit * 2,
    marginRight: theme.sizing.baseUnit,
  }),
  'ui-kit.FollowList.FollowListItem.FollowListImage.CellImage'
)(ConnectedImage);

const FollowListImage = ({ isLoading, source }) => {
  if (isLoading) {
    return <CellImage />;
  }
  return <CellImage source={source} />;
};

FollowListImage.propTypes = {
  source: ImageSourceType,
  isLoading: PropTypes.bool,
};

export default withIsLoading(FollowListImage);
