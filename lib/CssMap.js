class CssMap {
    constructor(CssMap) {
        this.cssmap = CssMap;
        this.classes = [];
        this.ids = [];
        this.init();
    }

    init() {
        this.cssmap.forEach((item) => {
            if (item.original[0] === '#') {
                this.ids.push(item.selector.slice(1));
                this.ids.push(item.strain.slice(1));
            } else if (item.original[0] === '.') {
                this.classes.push(item.selector.slice(1));
                this.classes.push(item.strain.slice(1));
            }
        });
    }

    hasClass(name) {
        return this.classes.includes(name);
    }

    hasId(name) {
        return this.ids.includes(name);
    }
}

module.exports = CssMap;