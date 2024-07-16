const cheerio = require('cheerio');

function loadCheerio(htmlBody) {
    const $ = cheerio.load(htmlBody);

    $.prototype.exists = function () {
        return this.length > 0;
    };

    $.prototype.hasDataStrainId = function () {
        return this.attr('data-strain-id') ? true : false;
    };
    
    $.prototype.hasDataStrainClass = function (class_name) {
        return this.attr('data-strain-class') ? this.attr('data-strain-class').includes(`[${class_name}]`) : false;
    };

    $.prototype.addStrainDataClass = function (strain_obj, class_name) {
        if (!strain_obj.classes_names.includes(class_name)) {
            const strain_class_name = strain_obj.strain(`.${class_name}`);
            const new_class_name = strain_class_name.slice(1);
            const current_class_data = this.getStrClassData();
            const new_class_data = `${current_class_data}[${class_name}]`;
            this.addClass(new_class_name);
            this.removeClass(class_name);
            this.attr('data-strain-class', new_class_data);
        }
        return this;
    };

    $.prototype.setStrainDataId = function (strain_obj, id_name) {
        if (!this.attr('data-strain-id')) {
            const strain_id_name = strain_obj.strain(`#${id_name}`);
            this.attr('id', strain_id_name.slice(1));
            this.attr('data-strain-id', id_name);
            return this;
        }
    };

    $.prototype.getStrClassData = function () {
        return this.attr('data-strain-class') ? this.attr('data-strain-class') : '';
    };

    $.prototype.setStrainData = function (old_property, new_property) {
        this.each(function () {
            const prefix = old_property[0];
            const old_property_name = old_property.slice(1);
            const new_property_name = new_property.slice(1).split(' ')[0];
            if (prefix === '#') {
                $(this).attr('id', new_property_name);
                $(this).attr('data-strain-id', old_property_name);
            } else if (prefix === '.') {
                const new_class_data = `[${old_property_name}]`;
                const current_class_data = $(this).getStrClassData();
                if (!current_class_data.includes(new_class_data)) {
                    $(this).addClass(new_property_name);
                    $(this).removeClass(old_property_name);
                    $(this).concatData('strain-class', `[${old_property_name}]`);
                }
            }
        });
        return this;
    };

    $.prototype.concatData = function (key, value) {
        this.each(function () {
            const current_data = $(this).attr(`data-${key}`) ? $(this).attr(`data-${key}`) : '';
            $(this).attr(`data-${key}`, `${current_data}${value}`);
        });
        return this;
    };

    $.prototype.strain = function (strain_obj) {
        this.each(function () {
            const current_id = $(this).attr('id');
            if (current_id) {
                $(this).setStrainDataId(strain_obj, current_id);
            }
            if ($(this).attr('class')) {
                const strain_classes = $(this).attr('class').split(' ');
                strain_classes.forEach((className) => {
                    $(this).addStrainDataClass(strain_obj, className);
                });
            }
        });

        return this;
    };

    return $;
}

module.exports = { loadCheerio }