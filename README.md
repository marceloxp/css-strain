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
}
.example {
    color: red;
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
    <h1 class="example">Hello World</h1>
    <div id="only-id" class="only-class another-only-class">Hello World</div>
    <div class="second-example another-example">Hello World One</div>
    <div class="another-example">Hello World Two</div>
    <div id="third-example">Hello World</div>
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
}

.prefix_v1_WojH_example {
    color: red;
}

.prefix_v1_MMHh_second-example {
    color: green;
}

.prefix_v1_vjDr_another-example {
    color: yellow;
}

#prefix_v1_PaOp_third-example {
    color: blue;
}
```

### HTML Result

```html
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="style.css">
    <script>
        const getStrainById = function(t) {
                return document.querySelector('[data-strain-id="' + t + '"]')
            },
            getStrainByClass = function(t) {
                return document.querySelectorAll('[data-strain-class*="[' + t + ']"]')
            };
    </script>
</head>

<body>
    <h1 class="prefix_v1_WojH_example" data-strain-class="[example]">Hello World</h1>
    <div id="prefix_v1_YxCG_only-id" class="prefix_v1_sIKV_only-class prefix_v1_ToJk_another-only-class" data-strain-id="only-id" data-strain-class="[only-class][another-only-class]">Hello World</div>
    <div class="prefix_v1_MMHh_second-example prefix_v1_vjDr_another-example" data-strain-class="[second-example][another-example]">Hello World One</div>
    <div class="prefix_v1_vjDr_another-example" data-strain-class="[another-example]">Hello World Two</div>
    <div id="prefix_v1_PaOp_third-example" data-strain-id="third-example">Hello World</div>
</body>

</html>
```

### Using helpers

```js
const element = getStrainById('third-example');
// Result: <div id="prefix_v1_MuUt_third-example" data-strain-id="third-example">Hello World</div>

const elements = getStrainByClass('another-example')
// Results:
// <div class="prefix_v1_iovW_second-example prefix_v1_MYzU_another-example" data-strain-class="[second-example][another-example]">Hello World One</div>
// <div class="prefix_v1_MYzU_another-example" data-strain-class="[another-example]">Hello World Two</div>
```

### Use css-strain to keep your CSS organized, secure, and conflict-free, with the flexibility to adjust your HTML as needed.
