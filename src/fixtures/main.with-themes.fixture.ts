import type { StorybookConfig } from '@storybook/react-webpack5';
const config: StorybookConfig = {
    stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)'],
    addons: ['@storybook/addon-essentials', '@storybook/addon-themes'],
    framework: {
        name: '@storybook/react-webpack5',
        options: {},
    },
    docs: {
        autodocs: true,
    },
};
export default config;
