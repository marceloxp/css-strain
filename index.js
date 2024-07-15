const { strainCss } = require('./lib/css');
const { strainHtml } = require('./lib/html');

function strainCssHtml(options) {
    let options_default = {
        cssBody: '',
        htmlBody: '',
        addHelpers: false,
        separator: null,
        randomLength: 4,
        prefix: null,
        version: null
    };

    const { cssBody, htmlBody, addHelpers, separator, randomLength, prefix, version } = Object.assign({}, options_default, options);

    const cssOptions = {
        cssBody,
        separator,
        randomLength,
        prefix,
        version
    };
    const cssResult = strainCss(cssOptions);

    const htmlOptions = {
        htmlBody,
        cssMap: cssResult.cssMaps,
        addHelpers,
        separator,
        randomLength,
        prefix,
        version
    };
    const htmlResult = strainHtml(htmlOptions);
    return { css: cssResult, html: htmlResult };
}

module.exports = {
    strainCss,
    strainHtml,
    strainCssHtml,
}
