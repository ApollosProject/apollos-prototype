import React from 'react';
import { Platform, View, KeyboardAvoidingView, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PropTypes from 'prop-types';
import {
  styled,
  Card,
  Button,
  withTheme,
  Icon,
  H2,
  H5,
  H6,
  UIText,
  Radio,
  DateInput,
  PaddedView,
  BackgroundView,
} from '@apollosproject/ui-kit';

const FlexedSafeAreaView = styled(
  { flex: 1 },
  'ui-auth.FlexedSafeAreaView'
)(SafeAreaView);

const FlexedKeyboardAvoidingView = styled(
  { flex: 1 },
  'ui-auth.FlexedKeyboardAvoidingView'
)(KeyboardAvoidingView);

const BrandIcon = withTheme(
  ({ theme }) => ({
    name: 'brand-icon',
    size: theme.sizing.baseUnit * 3.0,
    fill: theme.colors.text.primary,
    marginBottom: theme.sizing.baseUnit,
  }),
  'ui-auth.styles.BrandIcon'
)(Icon);

const TitleText = styled(
  ({ theme }) => ({
    color: theme.colors.action.primary,
  }),
  'ui-auth.styles.TitleText'
)(H2);

const PromptText = styled(
  ({ theme }) => ({
    color: theme.colors.text.primary,
    paddingBottom: theme.sizing.baseUnit * 1.5,
  }),
  'ui-auth.styles.PromptText'
)(H5);

const LegalText = styled(
  ({ theme }) => ({
    color: theme.colors.text.tertiary,
    fontWeight: 'normal',
  }),
  'ui-auth.styles.LegalText'
)(H6);

// Tab Login

const TabWrapper = styled(
  ({ theme }) => ({
    marginHorizontal: 0,
    marginVertical: 0,
    ...Platform.select(theme.shadows.default),
  }),
  'ui-auth.styles.TabWrapper'
)(Card);

const TabContainer = styled(
  ({ alternateLogin }) => ({
    flexDirection: alternateLogin ? 'row-reverse' : 'row',
    flex: 1,
  }),
  'ui-auth.styles.TabContainer'
)(View);

// We need a wrapping `View` because this style doesn't work when applied to a `Touchable` on android.
const TabButtonWrapper = styled(
  { flex: 1 },
  'ui-auth.styles.TabButtonWrapper'
)(View);

const TabButton = styled(
  ({ theme, isActive }) => ({
    alignItems: 'center',
    backgroundColor: isActive
      ? theme.colors.background.paper
      : theme.colors.background.screen,
    borderRadius: 0,
    borderWidth: 0,
    flexDirection: 'row',
    height: theme.sizing.baseUnit * 3,
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: theme.sizing.baseUnit,

    ...Platform.select(theme.shadows.none),
  }),
  'ui-auth.styles.TabButton'
)(View);

const TabButtonText = styled(
  ({ theme, isActive }) => ({
    color: isActive ? theme.colors.text.primary : theme.colors.text.tertiary,
  }),
  'ui-auth.styles.TabButtonText'
)(UIText);

const TabCard = styled(
  ({ theme }) => ({
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingTop: 0,
    marginHorizontal: 0,
    marginVertical: 0,
    ...Platform.select(theme.shadows.none),
  }),
  'ui-auth.styles.TabCard'
)(Card);

const FieldLabel = styled(
  ({ theme, padded }) => ({
    color: 'gray',
    opacity: 0.7,
    ...(padded ? { marginTop: theme.sizing.baseUnit } : {}),
  }),
  'ui-auth.styles.FieldLabel'
)(H6);

const DatePicker = styled(
  ({ theme }) => ({
    marginTop: 0,
    marginBottom: theme.sizing.baseUnit,
  }),
  'ui-auth.styles.DatePicker'
)(DateInput);

const RadioInput = styled(
  ({ theme }) => ({
    marginBottom: theme.sizing.baseUnit,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  }),
  'ui-auth.styles.RadioInput'
)(Radio);

const RadioLabel = styled(
  ({ theme }) => ({
    marginLeft: theme.sizing.baseUnit * 0.5,
  }),
  'ui-auth.styles.RadioLabel'
)(H5);

const ProfileEntryFieldContainer = ({
  BackgroundComponent,
  onPressNext,
  disabled,
  title,
  prompt,
  isLoading,
  children,
}) => (
  <BackgroundComponent>
    <FlexedSafeAreaView edges={['right', 'top', 'left']}>
      <FlexedKeyboardAvoidingView behavior={'padding'}>
        <ScrollView>
          <PaddedView>
            <TitleText>{title}</TitleText>
            <PromptText padded>{prompt}</PromptText>
            {children}
          </PaddedView>
        </ScrollView>

        {onPressNext ? (
          <PaddedView>
            <Button
              onPress={onPressNext}
              disabled={disabled}
              loading={isLoading}
              title={'Next'}
              type={'primary'}
              pill={false}
            />
          </PaddedView>
        ) : null}
      </FlexedKeyboardAvoidingView>
    </FlexedSafeAreaView>
  </BackgroundComponent>
);

ProfileEntryFieldContainer.propTypes = {
  title: PropTypes.node,
  prompt: PropTypes.string,
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  onPressNext: PropTypes.func, // used to navigate and/or submit the form
  BackgroundComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  children: PropTypes.node.isRequired,
};

ProfileEntryFieldContainer.defaultProps = {
  BackgroundComponent: BackgroundView,
};

export {
  FlexedSafeAreaView,
  FlexedKeyboardAvoidingView,
  BrandIcon,
  TitleText,
  PromptText,
  LegalText,
  TabCard,
  TabButton,
  TabButtonText,
  TabContainer,
  TabButtonWrapper,
  TabWrapper,
  FieldLabel,
  DatePicker,
  RadioInput,
  RadioLabel,
  ProfileEntryFieldContainer,
};
