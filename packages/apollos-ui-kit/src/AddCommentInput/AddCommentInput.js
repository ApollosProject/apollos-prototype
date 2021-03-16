import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, TextInput, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import styled from '../styled';
import { H4, H5, BodySmall } from '../typography';
import Touchable from '../Touchable';
import Avatar from '../Avatar';
import { withTheme } from '../theme';
import PaddedView from '../PaddedView';
import Modal, { ModalHeader } from '../Modal';
import { Switch } from '../inputs';

const CommentAvatar = withTheme(
  ({ theme: { sizing, colors } }) => ({
    themeSize: sizing.baseUnit * 3,
    buttonIcon: 'chunky-plus',
    iconButtonProps: {
      size: sizing.baseUnit * 0.75,
      fill: colors.white,
      iconBackground: colors.action.secondary,
    },
  }),
  'ui-kit.AddCommentInput.CommentAvatar'
)(Avatar);

const AddCommentContainer = styled(
  ({ theme: { sizing } }) => ({
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    padding: sizing.baseUnit,
    flexDirection: 'row',
    alignItems: 'center',
  }),
  'ui-kit.AddCommentInput.AddCommentContainer'
)(View);

const NextButton = styled(
  ({ theme: { colors } }) => ({
    color: colors.action.secondary,
  }),
  'ui-kit.AddCommentInput.NextButton'
)(H4);

const NextButtonTouchable = styled(
  { alignSelf: 'flex-end' },
  'ui-kit.AddCommentInput.NextButtonTouchable'
)(Touchable);

const AddCommentPrompt = styled(
  ({ theme: { sizing } }) => ({
    padding: sizing.baseUnit / 2,
  }),
  'ui-kit.AddCommentInput.AddCommentPrompt'
)(H5);

const AddCommentTextInput = styled(
  ({ theme: { sizing, colors } }) => ({
    minHeight: sizing.baseUnit * 4,
    color: colors.text.primary,
  }),
  'ui-kit.AddCommentInput.AddCommentTextInput'
)(TextInput);

const CommentInputContainer = styled(
  {},
  'ui-kit.AddCommentInput.CommentInputContainer'
)(PaddedView);

const UserData = styled(
  () => ({
    flexDirection: 'row',
    alignItems: 'center',
  }),
  'ui-kit.AddCommentInput.UserData'
)(PaddedView);

const UserName = styled(
  ({ theme }) => ({
    marginLeft: theme.sizing.baseUnit / 2,
  }),
  'ui-kit.AddCommentInput.UserName'
)(H4);

const ModalAvatar = withTheme(
  ({ theme: { sizing } }) => ({
    themeSize: sizing.baseUnit * 3,
  }),
  'ui-kit.AddCommentInput.CommentAvatar'
)(Avatar);

const ModalContent = styled(
  () => ({}),
  'ui-kit.AddCommentInput.ModalContent'
)(View);

const Share = styled(
  ({ theme }) => ({
    marginVertical: theme.sizing.baseUnit,
    paddingVertical: theme.sizing.baseUnit,
    paddingHorizontal: theme.sizing.baseUnit,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.lightSecondary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }),
  'ui-kit.AddCommentInput.Share'
)(View);

const CurrentText = styled(
  ({ theme }) => ({
    color: theme.colors.text.primary,
    fontSize: theme.typography.baseFontSize,
    lineHeight: theme.typography.baseLineHeight,
    paddingHorizontal: theme.sizing.baseUnit,
  }),
  'ui-kit.AddCommentInput.CurrentText'
)(Text);

const ShareText = styled(
  () => ({
    flexShrink: 1,
  }),
  'ui-kit.AddCommentInput.ShareText'
)(View);

const ShareDisclaimer = styled(
  ({ theme }) => ({
    color: theme.colors.text.tertiary,
  }),
  'ui-kit.AddCommentInput.ShareDisclaimer'
)(H5);

const AddCommentInput = ({ initialPrompt, addPrompt, onSubmit, profile }) => {
  const [isWriting, setIsWriting] = useState(false);
  const [currentText, setCurrentText] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [share, setShare] = useState('PRIVATE');

  const onPressSave = async () => {
    onSubmit && (await onSubmit(currentText, share)); // eslint-disable-line no-unused-expressions
    setConfirmModalOpen(false);
    setIsWriting(false);
  };

  const onStartWriting = () => {
    setCurrentText(null);
    setIsWriting(true);
  };

  return (
    <SafeAreaView>
      {isWriting ? (
        <CommentInputContainer>
          <BodySmall>{addPrompt}</BodySmall>
          <AddCommentTextInput
            multiline
            autoFocus
            onChangeText={(text) => setCurrentText(text)}
          />
          <NextButtonTouchable onPress={() => setConfirmModalOpen(true)}>
            <NextButton>{'Submit'}</NextButton>
          </NextButtonTouchable>
        </CommentInputContainer>
      ) : (
        <Touchable onPress={onStartWriting}>
          <AddCommentContainer>
            <CommentAvatar source={profile?.image} />
            <AddCommentPrompt>{currentText || initialPrompt}</AddCommentPrompt>
          </AddCommentContainer>
        </Touchable>
      )}
      <Modal
        visible={confirmModalOpen}
        animationType="slide"
        onRequestClose={() => setConfirmModalOpen(false)}
      >
        <ModalHeader
          onNext={onPressSave}
          onNextText="Save"
          title="New Journal"
        />
        <ModalContent>
          <UserData>
            <ModalAvatar source={profile?.image} />
            <UserName numberOfLines={1}>{profile?.nickName}</UserName>
          </UserData>
          <CurrentText>{currentText}</CurrentText>
          <Share>
            <ShareText>
              <H4>Share with the Community</H4>
              <ShareDisclaimer>
                Your name and photo will be visible to the community.
              </ShareDisclaimer>
            </ShareText>
            <Switch
              value={share === 'PUBLIC'}
              onValueChange={(value) => setShare(value ? 'PUBLIC' : 'PRIVATE')}
            />
          </Share>
        </ModalContent>
      </Modal>
    </SafeAreaView>
  );
};

AddCommentInput.propTypes = {
  initialPrompt: PropTypes.string,
  addPrompt: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    image: PropTypes.shape({ uri: PropTypes.string }),
    nickName: PropTypes.string,
  }),
};

AddCommentInput.defaultProps = {
  initialPrompt: 'Write Something...',
  addPrompt: 'What stands out to you?',
};

export default AddCommentInput;
