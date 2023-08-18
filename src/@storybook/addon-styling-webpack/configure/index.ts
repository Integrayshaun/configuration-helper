import dedent from 'dedent';

import { DEFAULT_CONFIGURATION_MAP, ConfigurationMap } from '../types';

import { generateCssRules } from './css-rules';
import { generateSassRules } from './sass-rules';
import { generateLessRules } from './less-rules';

const setConfigWithDefaults = (configMap: Partial<ConfigurationMap>): ConfigurationMap => ({
    ...DEFAULT_CONFIGURATION_MAP,
    ...configMap,
});

export const buildImports = (configMap: Partial<ConfigurationMap>): string => {
    const { vanillaExtract } = setConfigWithDefaults(configMap);

    return vanillaExtract
        ? dedent`
    import { VanillaExtractPlugin } from "@vanilla-extract/webpack-plugin";
    import MiniCssExtractPlugin from "mini-css-extract-plugin";

    `
        : '';
};

const buildPluginsArray = ({ vanillaExtract }: ConfigurationMap): string =>
    vanillaExtract
        ? dedent`
    plugins: [new VanillaExtractPlugin(), new MiniCssExtractPlugin()],`
        : '';

export const buildAddonConfig = (configMap: Partial<ConfigurationMap>): string => {
    const config = setConfigWithDefaults(configMap);

    return dedent`({
    name: "@storybook/addon-styling-webpack",
    options: {${buildPluginsArray(config)}
      rules: [${generateCssRules(config)}${generateSassRules(config)}${generateLessRules(config)}],
    }
  })`;
};
