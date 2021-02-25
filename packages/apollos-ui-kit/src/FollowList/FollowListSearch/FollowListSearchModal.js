import React from 'react';
import PropTypes from 'prop-types';
import {
  SafeAreaView,
  Modal,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { styled } from '@apollosproject/ui-kit';
import H4 from '../../typography/H4';
import FollowListSearch from '.';

const Header = styled(({ theme }) => ({
  width: '100%',
  height: theme.sizing.baseUnit * 4,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.sizing.baseUnit,
}))(View);

const Button = styled(({ theme }) => ({
  width: theme.sizing.baseUnit * 3,
}))(TouchableOpacity);

const ButtonText = styled(({ theme }) => ({
  color: theme.colors.primary,
  fontSize: theme.typography.baseFontSize,
  lineHeight: theme.typography.baseLineHeight,
  textAlign: 'right',
}))(Text);

const FollowListSearchModal = ({
  onSearch,
  onHide,
  onConfirm,
  onFollow,
  results,
  open,
  setModalOpen,
  title,
}) => {
  return (
    <Modal
      animationType="slide"
      onRequestClose={() => setModalOpen(false)}
      visible={open}
    >
      <SafeAreaView>
        <Header>
          <Button onPress={() => {}} />
          <H4>{title}</H4>
          <Button onPress={() => setModalOpen(false)}>
            <ButtonText numberOfLines={1}>Done</ButtonText>
          </Button>
        </Header>
        <FollowListSearch
          onSearch={onSearch}
          results={results}
          onHide={onHide}
          onConfirm={onConfirm}
          onFollow={onFollow}
        />
      </SafeAreaView>
    </Modal>
  );
};

FollowListSearchModal.propTypes = {
  title: PropTypes.string,
  open: PropTypes.bool,
  setModalOpen: PropTypes.func,
  onSearch: PropTypes.func,
  onHide: PropTypes.func,
  onConfirm: PropTypes.func,
  onFollow: PropTypes.func,
  results: PropTypes.arrayOf(PropTypes.object),
};

FollowListSearchModal.defaultProps = {
  title: 'Find People to Follow',
  onSearch: () => {},
  onHide: () => {},
  onConfirm: () => {},
  onFollow: () => {},
  results: [],
  open: false,
};

export default FollowListSearchModal;
