const cheerio = require('cheerio');
var beautify_html = require('js-beautify').html;

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

function strainHtml(htmlBody, cssMap, addHelpers = false) {
    try {
        const $ = cheerio.load(htmlBody);

        cssMap.forEach(({ selector, strain }) => {
            const parts = separateSelectors(selector);
            const newParts = separateSelectors(strain);

            parts.ids.forEach((id, index) => {
                $(`#${id}`).attr('data-strain-id', parts.ids[index]);
                $(`#${id}`).attr('id', newParts.ids[index]);
            });

            parts.classes.forEach((className, index) => {
                $(`.${className}`).each(function () {
                    const currentClass = $(this).attr('class');
                    const newClass = currentClass.replace(className, newParts.classes[index]);
                    $(this).attr('class', newClass);
                    if (!$(this).attr('data-strain-class')) {
                        $(this).attr('data-strain-class', `[${className}]`);
                    } else {
                        $(this).attr('data-strain-class', `${$(this).attr('data-strain-class')}[${className}]`);
                    }
                });
            });
        });

        if (addHelpers) {
            const helperScript = `<script>
                    const getStrainById = function(str_id) {
                        return document.querySelector('[data-strain-id="' + str_id + '"]');
                    }
                    const getStrainByClass = function(str_class) {
                        return document.querySelectorAll('[data-strain-class*="/' + str_class + '/"]');
                    }
                </script>`;

            const head = $('head');
            if (head.length > 0) {
                const headScript = head.find('script');
                if (headScript.length > 0) {
                    headScript.before(helperScript);
                } else {
                    head.append(helperScript);
                }
            } else {
                const newHtml = helperScript + htmlBody;
                $.html(newHtml);
            }
        }

        const pretyHtml = beautify_html(
            $.html(),
            {
                preserve_newlines: false,
            });

        return pretyHtml;
    } catch (error) {
        throw new Error(`Error processing HTML: ${error.message}`);
    }
}

module.exports = { strainHtml };
