const { strainCss } = require('./lib/css');
const { strainHtml } = require('./lib/html');

function strainCssHtml(cssBody, htmlBody, addHelpers = false, separator = null, randomLength = 4, prefix = '', version = null) {
    const cssResult = strainCss(cssBody, separator, randomLength, prefix, version);
    const htmlResult = strainHtml(htmlBody, cssResult.cssMaps, addHelpers);
    return { css: cssResult, html: htmlResult };
}

module.exports = {
    strainCss,
    strainHtml,
    strainCssHtml,
}
