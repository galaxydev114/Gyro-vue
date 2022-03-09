const path = require('path');

// Export a function. Accept the base config as the only param.
module.exports = {
  "stories": [
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  webpackFinal: async (config, { }) => {
    // Make whatever fine-grained changes you need
    config.module.rules.push({
      test: /\.s[ac]ss$/i,
      use: ['style-loader',
        'css-loader',
        'sass-loader',
        {
          loader: 'sass-loader',
          options: {
            prependData: `
						@import "node_modules/quasar/src/css/variables.sass";
						@import "@/css/quasar.variables.scss";
					`
          }
        }],
      include: path.resolve(__dirname, '../'),
    });
    config.resolve.alias['@'] = path.resolve(__dirname, '../src')

    config.optimization = {
      minimize: false,
      minimizer: []
    }

    // Return the altered config
    return config;
  },
};

