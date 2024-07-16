const { Strain } = require('./Strain');
const beautify_html = require('js-beautify').html;
const { loadCheerio } = require('./cheerio');

function getClassList(class_names) {
    let result = class_names.split(' ');
    result = result.filter(item => item !== '' && item !== '*');
    return result;
}

function strainHtml(options) {
    try {
        const options_default = {
            htmlBody: '',
            strainData: null,
            addHelper: false,
            separator: null,
            randomLength: 4,
            prefix: null,
            version: null
        };

        const { htmlBody, strainData, addHelper, separator, randomLength, prefix, version } = Object.assign({}, options_default, options);
        const strain_obj = new Strain({ separator, randomLength, prefix, version });
        strain_obj.import(strainData);
        const $ = loadCheerio(htmlBody);

        Object.keys(strain_obj.dict).forEach(type => {
            Object.keys(strain_obj.dict[type]).forEach(element_name => {
                const random = strain_obj.dict[type][element_name];
                const strain_query = strain_obj.mountQuerySelector(type, element_name, random);
                const ident = (type === 'i') ? '#' : '.';
                const element_query = `${ident}${element_name}`
                $(element_query).setStrainData(element_query, strain_query);
            });
        });

        const all_elements_ids = $('[id]');
        all_elements_ids.each((i, element) => {
            const element_id = $(element).attr('id');
            if (!strain_obj.hasId(element_id)) {
                if (!$(element).hasDataStrainId()) {
                    const element_query = `#${element_id}`;
                    const strain_query = strain_obj.strain(element_query);
                    const strain_name = strain_query.slice(1);
                    $(element).setStrainData(element_query, strain_query);
                    strain_obj.addToDict('i', element_id, strain_name);
                }
            }
        });

        const all_elements_classes = $('[class]');
        all_elements_classes.each((i, element) => {
            const element_classes = $(element).attr('class').split(' ');
            element_classes.forEach(element_class => {
                const element_query = `.${element_class}`;
                if (!strain_obj.hasStrainSelector('c', element_query)) {
                    const strain_query = strain_obj.strain(element_query);
                    const strain_name = strain_query.slice(1);
                    $(element).setStrainData(element_query, strain_query);
                    strain_obj.addToDict('c', element_class, strain_name);
                }
            })
        });

        if (addHelper) {
            const helperScript = strain_obj.getHelperBody();
            $('head').prepend(helperScript);
        }

        const pretyHtml = beautify_html($.html(), { preserve_newlines: false });
        return pretyHtml;
    } catch (error) {
        throw new Error(`Error processing HTML: ${error.message}`);
    }
}

module.exports = { strainHtml };
