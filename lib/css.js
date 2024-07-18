const css = require('css');
const { Strain } = require('./Strain');
const _ = require('lodash');
const { loadCheerio } = require('./cheerio');

class CssStrain {
    constructor(options) {
        let options_default = {
            separator: null,
            randomLength: 4,
            prefix: null,
            version: null,
        };

        let { separator, randomLength, prefix, version } = Object.assign(options_default, options);

        this.separator = separator;
        this.prefix = prefix;
        this.version = version;
        this.randomLength = randomLength;
        this.randoms = [];
        this.cache = {};
        this.dict = {
            classes: {},
            ids: {},
        };
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

    processSelectors($, selectors) {
        try {
            selectors.forEach((selector) => {
                selector.replace(/([#\.][a-zA-Z0-9_-]+)/g, (match) => {
                    if (this.blackList.includes(match)) {
                        return match;
                    }
                    if ($(match).hasNoStrain()) {
                        return match;
                    } else {
                        return this.strain.strain(match);
                    }
                });
            });
        } catch (error) {
            throw error;
        }
    }

    hasPseudoClass(selector) {
        return selector.includes(':') || selector.includes('::');
    }

    adjustSelectors($, rule) {
        try {
            const self = this;
            
            rule.selectors = rule.selectors.map(function (selector) {
                if (!self.hasPseudoClass(selector)) {
                    if ($(selector).hasNoStrain()) {
                        return selector;
                    }
                }
                return self.strain.getStrainSelector(selector);
            });

            return rule;
        } catch (error) {
            throw error;
        }
    }

    processCss(cssBody, htmlBody) {
        try {
            const $ = loadCheerio(htmlBody);

            const obj1 = css.parse(cssBody);
            obj1.stylesheet.rules.forEach((rule) => {
                switch (rule.type) {
                    case 'rule':
                        this.processSelectors($, rule.selectors);
                        break;
                    case 'media':
                        const rules = rule.rules;
                        rules.forEach((rule) => {
                            this.processSelectors($, rule.selectors);
                        });
                        break;
                }
            });

            const obj2 = css.parse(cssBody);
            obj2.stylesheet.rules.forEach((rule) => {
                switch (rule.type) {
                    case 'rule':
                        rule = this.adjustSelectors($, rule);
                        break;
                    case 'media':
                        rule.rules = rule.rules.map((rule) => {
                            rule = this.adjustSelectors($, rule);
                            return rule;
                        })
                        break;
                }
            });

            cssBody = css.stringify(obj2);

            const result = {
                css: cssBody,
                strain : this.strain.getData(),
            };

            return result;
        } catch (error) {
            throw new Error(`Error processing CSS: ${error.message}`);
        }
    }
}

function strainCss(options) {
    const options_default = {
        separator: null,
        randomLength: 4,
        prefix: null,
        version: null
    };

    const { cssBody, htmlBody, separator, randomLength, prefix, version } = Object.assign({}, options_default, options);

    const cssOptions = {
        separator,
        randomLength,
        prefix,
        version
    };

    const cssStrain = new CssStrain(cssOptions);
    return cssStrain.processCss(cssBody, htmlBody);
}

module.exports = { strainCss };
