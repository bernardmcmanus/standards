/**
 * Adapted from create-react-app InterpolateHtmlPlugin
 * @see https://github.com/facebook/create-react-app/blob/ed958938f642007645dd5ac3466db36202f8754e/packages/react-dev-utils/InterpolateHtmlPlugin.js
 */

// This webpack plugin lets us interpolate custom variables into `index.html`.
// Usage: `new InterpolateHtmlPlugin({ 'MY_VARIABLE': 42 })`
// Then, you can use %MY_VARIABLE% in your `index.html`.

// It works in tandem with HtmlWebpackPlugin.
// Learn more about creating plugins like this:
// https://github.com/ampedandwired/html-webpack-plugin#events

const HtmlWebpackPlugin = require('html-webpack-plugin');
const escapeStringRegexp = require('escape-string-regexp');

class InterpolateHtmlPlugin {
  constructor(replacements) {
    this.replacements = replacements;
  }

  apply(compiler) {
    const htmlWebpackPlugin = compiler.options.plugins.find(
      plugin => plugin.constructor === HtmlWebpackPlugin
    );
    if (!htmlWebpackPlugin) {
      throw new Error('Could not find HtmlWebpackPlugin');
    }
    compiler.hooks.compilation.tap('InterpolateHtmlPlugin', compilation => {
      htmlWebpackPlugin
        .getHooks(compilation)
        .afterTemplateExecution.tap('InterpolateHtmlPlugin', data => {
          // Run HTML through a series of user-specified string replacements.
          Object.keys(this.replacements).forEach(key => {
            const value = this.replacements[key];
            data.html = data.html.replace(
              new RegExp('%' + escapeStringRegexp(key) + '%', 'g'),
              value
            );
          });
        });
    });
  }
}

module.exports = InterpolateHtmlPlugin;
