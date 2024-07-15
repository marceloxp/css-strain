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
        this.randoms = [];
        this.classes_names = [];
        this.ids_names = [];
        this.cache = {};
        this.params = {
            version: (version === null) ? '' : `${separator}v${version}`,
            prefix: (prefix === null) ? '' : `${prefix}`,
            separator: (separator === null) ? '_' : separator,
        };
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

    hasIdName(name) {
        return this.ids_names.includes(name);
    }

    hasClassName(name) {
        return this.classes_names.includes(name);
    }

    ci(string, type) {
        const random = this.getRandomString(string, this.randomLength);
        const dothash = type === 'i' ? '#' : '.';
        const name = `${this.params.prefix}${this.params.version}${this.params.separator}${random}${this.params.separator}${string}`;
        const result = `${dothash}${name}`;

        if (type === 'i') {
            this.ids_names.push(name);
        } else {
            this.classes_names.push(name);
        }

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
}

module.exports = { Strain }
