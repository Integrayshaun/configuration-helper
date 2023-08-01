import { colors } from '@storybook/node-logger';
import prompts from 'prompts';

import { buildAddonConfig, buildImports } from '../../configure';
import {
    AddonStylingConfigurationStrategy,
    CONFIGURATION_KEY_TO_NAME,
    CONFIGURATION_STRATEGY_KEYS,
    ConfigurationKey,
    ConfigurationMap,
    DEFAULT_CONFIGURATION_MAP,
} from '../../types';
import { addImports, createNode } from 'src/utils/ast.utils';
import { printWarning } from 'src/utils/output.utils';

export const customStrategy: AddonStylingConfigurationStrategy = {
    name: CONFIGURATION_STRATEGY_KEYS.CUSTOM,
    predicate: (_) => true,
    main: async (mainConfig, meta) => {
        printWarning(
            '💬 I need your help',
            `I didn't recognize any styling tools in your project that I know how to configure.
      Here's a list of things I know how to configure...`,
        );

        const { configurations = [] } = await prompts(
            {
                type: 'multiselect',
                name: 'configurations',
                message: 'Select the styling tools that I should configure',
                instructions: false,
                choices: [
                    { title: 'CSS Modules', value: 'cssModules' },
                    { title: 'PostCSS', value: 'postcss' },
                    { title: 'Sass', value: 'sass' },
                    { title: 'Less', value: 'less' },
                    { title: 'Vanilla Extract', value: 'vanillaExtract' },
                ],
                hint: '- Space to select. Return to submit',
            },
            { onCancel: () => process.exit(0) },
        );

        const configMap = configurations.reduce((map: ConfigurationMap, key: keyof ConfigurationMap) => {
            return {
                ...map,
                [key]: true,
            };
        }, DEFAULT_CONFIGURATION_MAP as ConfigurationMap);

        if (Object.keys(configMap).length === 0) {
            //TODO handle no-op case
        }

        if (configMap.vanillaExtract) {
            // Add imports for webpack plugins
            const importsNode = createNode(buildImports(configMap));
            addImports(mainConfig._ast, importsNode);
        }

        const [addonConfigNode] = createNode(buildAddonConfig(configMap));

        mainConfig.appendNodeToArray(['addons'], addonConfigNode.expression);

        const configuredTools = Object.keys(configMap)
            .filter((tool: ConfigurationKey) => configMap[tool])
            .map(
                (tool: ConfigurationKey) =>
                    `Configured ${colors.blue.bold(CONFIGURATION_KEY_TO_NAME[tool])} for ${colors.blue.bold(
                        'webpack',
                    )}`,
            );

        return {
            changed: [...configuredTools],
            nextSteps: [`🚀 Launch ${colors.pink.bold('storybook')}`],
        };
    },
};
