# css-strain

![Banner](banner.png)

**css-strain** is a powerful tool for CSS selector obfuscation with optional HTML file adjustments. It's ideal for avoiding class and ID conflicts in large-scale projects, where code maintenance and consistency are essential.

## Features

- **CSS Selector Obfuscation:** Generates unique and random selectors for classes and IDs, preventing conflicts and overlaps.
- **Optional HTML Manipulation:** Automatically replaces old selectors with new ones in HTML files, ensuring visual styles remain intact. This feature can be used independently or in combination with CSS obfuscation.
- **Flexible Configuration:** Allows customization of prefixes, versions, and the length of random strings to best fit your project.
- **Simple Integration:** Easy to use with minimal integration, making it perfect for new or existing projects.

## Try online

[https://onecompiler.com/nodejs/42jpsvrj8](https://onecompiler.com/nodejs/42jpsvrj8)

## Usage

### Node.js

```js
const fs = require('fs');
const { strainCssHtml } = require('css-strain');

const body_html = fs.readFileSync('./index.html', 'utf8');
const body_css = fs.readFileSync('./assets/css/style.css', 'utf8');

const options = {
    cssBody: body_css,
    htmlBody: body_html,
    addHelpers: true,
    separator: '_',
    randomLength: 4,
    prefix: 'prefix',
    version: 1
};

const strained = strainCssHtml(options);
```

## Sources

### CSS Source

```css
body {
    color: black;
    background-color: silver;
    padding: 10px;
    font-family: Arial, Helvetica, sans-serif;
}

#fourth-example.yet-another-random-example {
    color: orange;
}

.first-section * {
    margin: 0;
    padding: 2px;
}

.example {
    color: red;
}

.example::before {
    content: '🔗';
}

.second-example {
    color: green;
}

.another-example {
    color: yellow;
}

#third-example {
    color: blue;
}

#fourth-example .another-random-example {
    color: orange;
}

 /* media to screens smaller than 770px  */
@media only screen and (max-width: 770px) {
    .example {
        color: blue;
    }
}

```

### HTML Source

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <section class="first-section" no-strain="no-strain">
        <h1 class="example">Hello World Example</h1>
        <div id="only-id" class="only-class another-only-class">Only ID and Only Class</div>
        <div class="second-example another-example">Second and Another Example</div>
        <div class="another-example">Another Example</div>
        <div id="third-example">Third Example</div>
        <div id="fourth-example"><div class="another-random-example">Fourth Example</div></div>
        <div id="void-example" no-strain="no-strain">Void Example</div>
    </section>
    <script src="index.js"></script>
</body>

</html>
```

## Results

### CSS Result

```css
body {
  color: black;
  background-color: silver;
  padding: 10px;
  font-family: Arial, Helvetica, sans-serif;
}

#prefix_v1_XzWT_fourth-example.prefix_v1_fJzo_yet-another-random-example {
  color: orange;
}

.first-section * {
  margin: 0;
  padding: 2px;
}

.prefix_v1_lgCs_example {
  color: red;
}

.prefix_v1_lgCs_example::before {
  content: '🔗';
}

.prefix_v1_nSPL_second-example {
  color: green;
}

.prefix_v1_yOUZ_another-example {
  color: yellow;
}

#prefix_v1_zLlC_third-example {
  color: blue;
}

#prefix_v1_XzWT_fourth-example .prefix_v1_CbkY_another-random-example {
  color: orange;
}

/* media to screens smaller than 770px  */

@media only screen and (max-width: 770px) {
  .prefix_v1_lgCs_example {
    color: blue;
  }
}
```

### HTML Result

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <script>
        window.strainDict = {
            "version": "_v1",
            "prefix": "prefix",
            "separator": "_",
            "dict": {
                "c": {
                    "yet-another-random-example": "fJzo",
                    "example": "lgCs",
                    "second-example": "nSPL",
                    "another-example": "yOUZ",
                    "another-random-example": "CbkY",
                    "first-section": "enuk",
                    "only-class": "erKV",
                    "another-only-class": "uIck"
                },
                "i": {
                    "fourth-example": "XzWT",
                    "third-example": "zLlC",
                    "only-id": "gndZ",
                    "void-example": "yGMm"
                }
            },
            "dothash": {
                "c": ".",
                "i": "#"
            }
        };

        function getStrainSelector(selector) {
            return selector.replace(/([#.][a-zA-Z0-9_-]+)/g, (match) => {
                const element = match[0];
                const type = element === '#' ? 'i' : 'c';;
                const source = match.slice(1);
                const random = window.strainDict.dict[type][source];
                return `${window.strainDict.dothash[type] || ''}${window.strainDict.prefix || ''}${window.strainDict.version || ''}${window.strainDict.separator || ''}${random}${window.strainDict.separator || ''}${source}`;
            });
        }

        function strainGetName(selector) {
            const result = getStrainSelector(selector);
            return result.slice(1);
        }

        function strainGetElementById(selector) {
            const element_id = strainGetName('#' + selector);
            return document.getElementById(element_id);
        }

        function strainQuerySelector(selector) {
            return document.querySelector(getStrainSelector(selector));
        }

        function strainQuerySelectorAll(selector) {
            return document.querySelectorAll(getStrainSelector(selector));
        }
    </script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <section class="first-section" no-strain="no-strain">
        <h1 class="prefix_v1_lgCs_example" data-strain-class="[example]">Hello World Example</h1>
        <div id="prefix_v1_gndZ_only-id" class="prefix_v1_erKV_only-class prefix_v1_uIck_another-only-class" data-strain-id="only-id" data-strain-class="[only-class][another-only-class]">Only ID and Only Class</div>
        <div class="prefix_v1_nSPL_second-example prefix_v1_yOUZ_another-example" data-strain-class="[second-example][another-example]">Second and Another Example</div>
        <div class="prefix_v1_yOUZ_another-example" data-strain-class="[another-example]">Another Example</div>
        <div id="prefix_v1_zLlC_third-example" data-strain-id="third-example">Third Example</div>
        <div id="prefix_v1_XzWT_fourth-example" data-strain-id="fourth-example">
            <div class="prefix_v1_CbkY_another-random-example" data-strain-class="[another-random-example]">Fourth Example</div>
        </div>
        <div id="void-example" no-strain="no-strain">Void Example</div>
    </section>
    <script src="index.js"></script>
</body>

</html>
```

### Using helpers

```js
getStrainSelector('#only-id.only-class')
// #prefix_v1_gndZ_only-id.prefix_v1_erKV_only-class

strainGetElementById('only-id')
// <div id="prefix_v1_gndZ_only-id" class="prefix_v1_erKV_only-class prefix_v1_uIck_another-only-class" data-strain-id="only-id" data-strain-class="[only-class][another-only-class]">Only ID and Only Class</div>

strainQuerySelectorAll('.another-example')
// <div class="prefix_v1_nSPL_second-example prefix_v1_yOUZ_another-example" data-strain-class="[second-example][another-example]">Second and Another Example</div>
// <div class="prefix_v1_yOUZ_another-example" data-strain-class="[another-example]">Another Example</div>
```

### Use css-strain to keep your CSS organized, secure, and conflict-free, with the flexibility to adjust your HTML as needed.
