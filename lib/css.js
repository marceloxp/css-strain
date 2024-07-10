const css = require('css');

class CssStrain {
    constructor(separator = null, randomLength = 4, prefix = null, version = null) {
        this.separator = (separator === null) ? '_' : separator;
        this.prefix = (prefix === null) ? '' : `${prefix}`;
        this.version = (version === null) ? '' : `${this.separator}v${version}`;
        this.randomLength = randomLength;
        this.randoms = [];
        this.selectors = [];
        this.notSelectors = [];
        this.cache = {};
        this.blackList = [
            '*', 'body', 'html', 'head', 'script', 'style', 'link', 'meta'
        ];
    }

    getRandomString(elementName, length) {
        if (this.cache[elementName]) {
            return this.cache[elementName];
        }
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        if (this.randoms.includes(result)) {
            return this.getRandomString(elementName, length);
        }
        this.randoms.push(result);
        this.cache[elementName] = result;
        return result;
    }

    ci(string, type) {
        const random = this.getRandomString(string, this.randomLength);
        const dothash = type === 'i' ? '#' : '.';
        return `${dothash}${this.prefix}${this.version}${this.separator}${random}${this.separator}${string}`;
    }

    elementReplacer(selector) {
        const type = selector[0] === '#' ? 'i' : 'c';
        const string = selector.slice(1);
        return this.ci(string, type);
    }

    strain(selector) {
        return selector.replace(/([#\.][a-zA-Z0-9_-]+)/g, (match) => {
            return this.elementReplacer(match);
        });
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
                        const strainSelector = this.strain(selector);
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

function strainCss(cssBody, separator = null, randomLength = 4, prefix = null, version = null) {
    const cssStrain = new CssStrain(separator, randomLength, prefix, version);
    return cssStrain.processCss(cssBody);
}

module.exports = { strainCss };
