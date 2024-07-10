# css-strain

![Banner](banner.png)
**css-strain** is a powerful tool for CSS selector obfuscation with optional HTML file adjustments. It's ideal for avoiding class and ID conflicts in large-scale projects, where code maintenance and consistency are essential.

## Features

- **CSS Selector Obfuscation:** Generates unique and random selectors for classes and IDs, preventing conflicts and overlaps.
- **Optional HTML Manipulation:** Automatically replaces old selectors with new ones in HTML files, ensuring visual styles remain intact. This feature can be used independently or in combination with CSS obfuscation.
- **Flexible Configuration:** Allows customization of prefixes, versions, and the length of random strings to best fit your project.
- **Simple Integration:** Easy to use with minimal integration, making it perfect for new or existing projects.

## Usage

### Node.js

```js
const fs = require('fs');
const { strainCssHtml } = require('css-strain');

const body_html = fs.readFileSync('./index.html', 'utf8');
const body_css = fs.readFileSync('./assets/css/style.css', 'utf8');

const strained = strainCssHtml(body_css, body_html, '_', 4, 'prefix', 1);
```

### Output

```js
{
  css: {
    cssMaps: [
      {
        original: '.example',
        selector: '.example',
        strain: '.prefix_v1_PljQ_example'
      },
      {
        original: '.second-example',
        selector: '.second-example',
        strain: '.prefix_v1_IpOq_second-example'
      },
      {
        original: '#third-example',
        selector: '#third-example',
        strain: '#prefix_v1_eTNY_third-example'
      }
    ],
    selectors: [ '.example', '.second-example', '#third-example' ],
    notSelectors: [ 'body' ],
    css: '\n' +
      '        body {\n' +
      '            color: black;\n' +
      '            background-color: silver;\n' +
      '            padding: 10px;\n' +
      '        }\n' +
      '        .prefix_v1_PljQ_example {\n' +
      '            color: red;\n' +
      '        }\n' +
      '        .prefix_v1_IpOq_second-example {\n' +
      '            color: green;\n' +
      '        }\n' +
      '        #prefix_v1_eTNY_third-example {\n' +
      '            color: blue;\n' +
      '        }\n' +
      '    '
  },
  html: '<!DOCTYPE html><html lang="en"><head>\n' +
    '            <meta charset="UTF-8">\n' +
    '            <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
    '            <title>Document</title>\n' +
    '            <link rel="stylesheet" href="style.css">\n' +
    '        </head>\n' +
    '        <body>\n' +
    '            <h1 class="prefix_v1_PljQ_example">Hello World</h1>\n' +
    '            <div class="prefix_v1_IpOq_second-example">Hello World</div>\n' +
    '            <div id="prefix_v1_eTNY_third-example">Hello World</div>\n' +
    '    </body>
    </html>'
}
```

### Use css-strain to keep your CSS organized, secure, and conflict-free, with the flexibility to adjust your HTML as needed.
