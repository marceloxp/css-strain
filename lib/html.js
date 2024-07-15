const { Strain } = require('./Strain');
const CssMap = require('./CssMap');
const beautify_html = require('js-beautify').html;
const { loadCheerio } = require('./cheerio');

function strainHtml(options) {
    try {
        const options_default = {
            htmlBody: '',
            cssMap: [],
            addHelpers: false,
            separator: null,
            randomLength: 4,
            prefix: null,
            version: null
        };

        const { htmlBody, cssMap, addHelpers, separator, randomLength, prefix, version } = Object.assign({}, options_default, options);
        const strain_obj = new Strain({ separator, randomLength, prefix, version });
        const $ = loadCheerio(htmlBody);
        const cssmap = new CssMap(cssMap);

        cssmap.cssmap.forEach(({ selector, strain }) => {
            $(selector).setStrainData(selector, strain);
        });

        const all_elements_ids = $('[id]');
        all_elements_ids.each((i, element) => {
            const element_id = $(element).attr('id');
            if (!cssmap.hasId(element_id)) {
                $(element).strain(strain_obj);
            }
        });

        const all_elements_classes = $('[class]');
        all_elements_classes.each((i, element) => {
            const element_classes = $(element).attr('class').split(' ');
            element_classes.forEach((element_class) => {
                if (!cssmap.hasClass(element_class)) {
                    $(element).strain(strain_obj);
                }
            });
        });

        if (addHelpers) {
            const helperScript = `<script>const getStrainById=function(t){return document.querySelector('[data-strain-id="'+t+'"]')},getStrainByClass=function(t){return document.querySelectorAll('[data-strain-class*="['+t+']"]')};</script>`;

            // const helperScript = `<script>
            //         const getStrainById = function(str_id) {
            //             return document.querySelector('[data-strain-id="' + str_id + '"]');
            //         }
            //         const getStrainByClass = function(str_class) {
            //             return document.querySelectorAll('[data-strain-class*="[' + str_class + ']"]');
            //         }
            //     </script>`;

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

        const pretyHtml = beautify_html($.html(), { preserve_newlines: false });
        return pretyHtml;
    } catch (error) {
        throw new Error(`Error processing HTML: ${error.message}`);
    }
}

module.exports = { strainHtml };
