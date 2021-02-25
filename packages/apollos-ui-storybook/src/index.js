import React from 'react';
import { getStorybookUI, addDecorator } from '@storybook/react-native';

import { loadStories as loadAnalyticsStories } from '@apollosproject/ui-analytics/storybook/storyLoader';
import { loadStories as loadAuthStories } from '@apollosproject/ui-auth/storybook/storyLoader';
import { loadStories as loadHTMLViewStories } from '@apollosproject/ui-htmlview/storybook/storyLoader';
import { loadStories as loadUiKitStories } from '@apollosproject/ui-kit/storybook/storyLoader';
import { loadStories as loadPassesStories } from '@apollosproject/ui-passes/storybook/storyLoader';
import { loadStories as loadPrayerStories } from '@apollosproject/ui-prayer/storybook/storyLoader';
import { loadStories as loadOnboardingStories } from '@apollosproject/ui-notifications/storybook/storyLoader';
import { loadStories as loadNotificationsStories } from '@apollosproject/ui-onboarding/storybook/storyLoader';
import { loadStories as loadMapViewStories } from '@apollosproject/ui-mapview/storybook/storyLoader';
import { loadStories as loadScriptureStories } from '@apollosproject/ui-scripture/storybook/storyLoader';
import { loadStories as loadConnectedStories } from '@apollosproject/ui-connected/storybook/storyLoader';
import { loadStories as loadApollosPlayerStories } from '@apollosproject/ui-media-player/storybook/storyLoader';

import { Providers as UIKitProviders } from '@apollosproject/ui-kit';

export * from '@storybook/react-native';

export const addApollosProviderDecorator = (Providers = UIKitProviders) =>
  addDecorator((renderStorybook) => <Providers>{renderStorybook()}</Providers>);

// import stories
export const loadApollosStories = () => {
  loadAnalyticsStories();
  loadAuthStories();
  loadHTMLViewStories();
  loadUiKitStories();
  loadPassesStories();
  loadPrayerStories();
  loadOnboardingStories();
  loadNotificationsStories();
  loadMapViewStories();
  loadScriptureStories();
  loadConnectedStories();
  loadApollosPlayerStories();
};

// Refer to https://github.com/storybooks/storybook/tree/master/app/react-native#start-command-parameters
// To find allowed options for getStorybookUI
const StorybookUIRoot = getStorybookUI({
  // Fixes keyboard auto-closing itself when using `react-native-tab-bar`
  shouldDisableKeyboardAvoidingView: true,
  // Default to the UI hidden (what we want in most cases)
  isUIHidden: true,
});

export default StorybookUIRoot;
