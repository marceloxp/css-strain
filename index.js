const { strainCss } = require('./lib/css');
const { strainHtml } = require('./lib/html');

function strainCssHtml(options) {
    let options_default = {
        cssBody: '',
        htmlBody: '',
        addHelper: false,
        separator: null,
        randomLength: 4,
        prefix: null,
        version: null
    };

    const { cssBody, htmlBody, addHelper, separator, randomLength, prefix, version } = Object.assign({}, options_default, options);

    const cssOptions = {
        cssBody,
        htmlBody,
        separator,
        randomLength,
        prefix,
        version
    };
    const cssResult = strainCss(cssOptions);

    const htmlOptions = {
        htmlBody,
        strainData: cssResult.strain,
        addHelper,
        separator,
        randomLength,
        prefix,
        version
    };
    const htmlResult = strainHtml(htmlOptions);
    return { css: cssResult, html: htmlResult };
}

module.exports = {
    strainCssHtml,
}
