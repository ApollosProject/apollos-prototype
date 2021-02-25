import React, { memo } from 'react';
import PropTypes from 'prop-types';

import {
  SmokeAndMirrorsWrapper,
  ClearSearchButtonBackground,
  ClearSearchButton,
  CancelButton,
} from './styles';

const SearchActions = memo(
  ({
    cancelButtonText,
    onPressCancel,
    onPressClearSearchButton,
    onLayout,
    screenBackgroundColor,
    showClearSearchButton,
    showCancelButton,
  }) => (
    <SmokeAndMirrorsWrapper screenBackgroundColor={screenBackgroundColor}>
      <ClearSearchButtonBackground>
        <ClearSearchButton
          onPress={onPressClearSearchButton}
          name={'close'}
          isVisible={showClearSearchButton}
        />
      </ClearSearchButtonBackground>

      {showCancelButton && (
        <CancelButton onPress={onPressCancel} onLayout={onLayout}>
          {cancelButtonText}
        </CancelButton>
      )}
    </SmokeAndMirrorsWrapper>
  )
);

SearchActions.propTypes = {
  cancelButtonText: PropTypes.string,
  onPressCancel: PropTypes.func,
  onPressClearSearchButton: PropTypes.func,
  onLayout: PropTypes.func,
  /* In order for this components animation to work correctly you need match this value to this
   * components surroundings. You only need this if you are rendering `Search` on a color other
   * than theme.colors.background.paper. */
  screenBackgroundColor: PropTypes.string,
  showClearSearchButton: PropTypes.bool,
  showCancelButton: PropTypes.bool,
};

SearchActions.displayName = 'SearchActions';

export default SearchActions;
