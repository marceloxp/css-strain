const css = require('css');
const { Strain } = require('./Strain');
const beautify_css = require('js-beautify').css;

class CssStrain {
    constructor(options) {
        let options_default = {
            separator: null,
            randomLength: 4,
            prefix: null,
            version: null
        };

        let { separator, randomLength, prefix, version } = Object.assign(options_default, options);

        this.separator = separator;
        this.prefix = prefix;
        this.version = version;
        this.randomLength = randomLength;
        this.randoms = [];
        this.selectors = [];
        this.notSelectors = [];
        this.cache = {};
        this.blackList = [
            '*', 'body', 'html', 'head', 'script', 'style', 'link', 'meta'
        ];
        this.strain = new Strain({ separator, randomLength, prefix, version });
    }

    getOnlySelectorName(selector) {
        const replaces = [
            ':checked',
            ':disabled',
            ':focus',
            ':hover',
            ':active',
            ':after',
            ':before',
            ':first-of-type',
            ':last-of-type',
            ':nth-of-type',
            ':nth-last-of-type',
            ':not',
        ];

        let result = selector.replace(/~/g, '');

        replaces.forEach((replace) => {
            result = result.replace(replace, '');
        });

        return result;
    }

    processCss(cssBody) {
        try {
            const obj = css.parse(cssBody);
            const cssMaps = [];
            obj.stylesheet.rules.forEach((rule) => {
                if (rule.type === 'rule') {
                    rule.selectors.forEach((selector) => {
                        if (this.blackList.includes(selector)) {
                            this.notSelectors.push(selector);
                            return;
                        }
                        const strainSelector = this.strain.strain(selector);
                        if (strainSelector !== selector) {
                            cssMaps.push({
                                original: selector,
                                selector: this.getOnlySelectorName(selector),
                                strain: strainSelector,
                            });
                            this.selectors.push(selector);
                        } else {
                            this.notSelectors.push(selector);
                        }
                    });
                }
            });

            // change cssMaps to new css
            cssMaps.forEach((cssMap) => {
                cssBody = cssBody.replace(cssMap.original, cssMap.strain);
            });

            cssBody = beautify_css(cssBody);

            return {
                cssMaps: cssMaps,
                selectors: this.selectors,
                notSelectors: this.notSelectors,
                css: cssBody,
            };
        } catch (error) {
            throw new Error(`Error processing CSS: ${error.message}`);
        }
    }
}

function strainCss(options) {
    const options_default = {
        cssBody: '',
        separator: null,
        randomLength: 4,
        prefix: null,
        version: null
    };

    const { cssBody, separator, randomLength, prefix, version } = Object.assign({}, options_default, options);

    const cssOptions = {
        separator,
        randomLength,
        prefix,
        version
    };

    const cssStrain = new CssStrain(cssOptions);
    return cssStrain.processCss(cssBody);
}

module.exports = { strainCss };
