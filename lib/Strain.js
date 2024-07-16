const _ = require('lodash');

class Strain {
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
        this.dict = {
            c: {},
            i: {},
        };
        this.dothash = {
            c: '.',
            i: '#',
        }
        this._setParams();
    }

    _setParams() {
        this.params = {
            version: (this.version === null) ? '' : `${this.separator}v${this.version}`,
            prefix: (this.prefix === null) ? '' : `${this.prefix}`,
            separator: (this.separator === null) ? '_' : this.separator,
        };
    }

    import(strain_data) {
        this.dict = Object.assign(this.dict, strain_data.dict);
        this.separator = strain_data.config.separator;
        this.prefix = strain_data.config.prefix;
        this.version = strain_data.config.version;
        this.randomLength = strain_data.config.randomLength;
        this._setParams();
    }

    getData() {
        return {
            config: {
                separator: this.separator,
                randomLength: this.randomLength,
                prefix: this.prefix,
                version: this.version,
            },
            params: this.params,
            dict: this.dict,
        }
    }

    getTypeByString(string) {
        return string[0] === '#' ? 'i' : 'c';
    }

    mountQuerySelector(type, element_query, random) {
        return `${this.dothash[type]}${this.params.prefix}${this.params.version}${this.params.separator}${random}${this.params.separator}${element_query}`
    }

    getStrainSelector(selector) {
        return selector.replace(/([#\.][a-zA-Z0-9_-]+)/g, (match) => {
            const element = match[0];
            const type = this.getTypeByString(element);
            const source = match.slice(1);
            const random = this.dict[type][source];
            return `${this.dothash[type]}${this.params.prefix}${this.params.version}${this.params.separator}${random}${this.params.separator}${source}`;
        });
    }

    getRandomString(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }

    getUniqueRandomString(name, type, length) {
        const result = this.getRandomString(length);

        if (this.dict[type][result] !== undefined) {
            return this.getUniqueRandomString(type, length);
        }

        this.addToDict(type, name, result);

        return result;
    }

    hasStrainSelector(type, selector) {
        let result = false;
        Object.keys(this.dict[type]).forEach((name) => {
            const strain_query = this.mountQuerySelector(type, name, this.dict[type][name]);
            if (selector === strain_query) {
                result = true;
                return;
            }
        })

        return result;
    }

    hasName(type, name) {
        return this.dict[type][name] !== undefined;
    }

    hasId(name) {
        return this.hasName('i', name);
    }

    hasClass(name) {
        return this.hasName('c', name);
    }

    addToDict(type, string, random) {
        if (!this.hasName(type, string)) {
            this.dict[type][string] = random;
        }
    }

    ci(string, type) {
        const random = this.getUniqueRandomString(string, type, this.randomLength);
        const name = `${this.params.prefix}${this.params.version}${this.params.separator}${random}${this.params.separator}${string}`;
        const result = `${this.dothash[type]}${name}`;
        this.addToDict(type, string, random);

        return result;
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

    getHelperBody() {
        const obj = _.merge(this.params, { dict: this.dict, dothash: this.dothash });
        const js_body = `<script>
            window.strainDict = ${JSON.stringify(obj)};
            function getStrainSelector(selector) {
                return selector.replace(/([#\.][a-zA-Z0-9_-]+)/g, (match) => {
                    const element = match[0];
                    const type = element === '#' ? 'i' : 'c';;
                    const source = match.slice(1);
                    const random = window.strainDict.dict[type][source];
                    return \`\${window.strainDict.dothash[type] || ''}\${window.strainDict.prefix || ''}\${window.strainDict.version || ''}\${window.strainDict.separator || ''}\${random}\${window.strainDict.separator || ''}\${source}\`;
                });
            }
        </script>`;

        return js_body;
    }
}

module.exports = { Strain }
