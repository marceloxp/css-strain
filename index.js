const { strainCss } = require('./lib/css');
const { strainHtml } = require('./lib/html');

function strainCssHtml(cssBody, htmlBody, randomLength = 4, prefix = '', version = null) {
    return {
        css: strainCss(cssBody, randomLength, prefix, version),
        html: strainHtml(htmlBody, cssBody)
    }
}

module.exports = {
    strainCss,
    strainHtml,
    strainCssHtml,
}
