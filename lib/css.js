const css = require('css');
const { Strain } = require('./Strain');
const _ = require('lodash');
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
            ' *',
            '::checked',
            '::disabled',
            '::focus',
            '::hover',
            '::active',
            '::after',
            '::before',
            '::first-of-type',
            '::last-of-type',
            '::nth-of-type',
            '::nth-last-of-type',
            '::not',
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

    cssMapsHasItem(cssMaps, item) {
        let result = false;

        cssMaps.forEach((_item) => {
            if (_.isEqual(_item, item)) {
                result = true;
                return;
            }
        });

        return result;
    }

    processSelectors(selectors, cssMaps) {
        selectors.forEach((_selectors) => {
            const items = _selectors.split(' ');
            items.forEach((selector) => {
                if (this.blackList.includes(selector)) {
                    this.notSelectors.push(selector);
                    return;
                }
                const strainSelector = this.strain.strain(selector);
                if (strainSelector !== selector) {
                    const item = {
                        original: selector,
                        selector: this.getOnlySelectorName(selector),
                        strain: strainSelector,
                    };
                    if (!this.cssMapsHasItem(cssMaps, item)) {
                        cssMaps.push(item);
                        this.selectors.push(selector);
                    }
                } else {
                    this.notSelectors.push(selector);
                }                
            })
        });
    }

    processCss(cssBody) {
        try {
            const obj = css.parse(cssBody);
            const cssMaps = [];
            obj.stylesheet.rules.forEach((rule) => {
                switch (rule.type) {
                    case 'rule':
                        this.processSelectors(rule.selectors, cssMaps);
                        break;
                    case 'media':
                        const rules = rule.rules;
                        rules.forEach((rule) => {
                            this.processSelectors(rule.selectors, cssMaps);
                        });
                        break;
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
