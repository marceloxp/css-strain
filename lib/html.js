const cheerio = require('cheerio');

function separateSelectors(selector) {
    try {
        const elements = [];
        const classes = [];
        const ids = [];

        const regex = /([#\.]?[^#\. ]+)/g;
        let match;

        while ((match = regex.exec(selector)) !== null) {
            const part = match[0];
            if (part.startsWith('#')) {
                ids.push(part.slice(1));
            } else if (part.startsWith('.')) {
                classes.push(part.slice(1));
            } else {
                elements.push(part);
            }
        }

        return {
            elements: elements,
            classes: classes,
            ids: ids
        };
    } catch (error) {
        throw new Error(`Error processing CSS selector: ${selector}: ${error.message}`);
    }
}

function strainHtml(htmlBody, cssMap) {
    try {
        const $ = cheerio.load(htmlBody);

        cssMap.forEach(({ selector, strain }) => {
            const parts = separateSelectors(selector);
            const newParts = separateSelectors(strain);

            parts.ids.forEach((id, index) => {
                $(`#${id}`).attr('id', newParts.ids[index]);
            });

            parts.classes.forEach((className, index) => {
                $(`.${className}`).each(function () {
                    const currentClass = $(this).attr('class');
                    const newClass = currentClass.replace(className, newParts.classes[index]);
                    $(this).attr('class', newClass);
                });
            });
        });

        return $.html();
    } catch (error) {
        throw new Error(`Error processing HTML: ${error.message}`);
    }
}

module.exports = { strainHtml };
