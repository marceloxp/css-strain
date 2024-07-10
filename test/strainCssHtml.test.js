const { strainCssHtml } = require('../index'); // ajuste o caminho conforme necessário

describe('strainCssHtml', async () => {
    let expect;
    before(async function () {
        ({ expect } = await import('chai'));
    });

    const cssBody = `
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
        #third-example {
            color: blue;
        }
    `;

    const htmlBody = `
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
            <div class="second-example">Hello World</div>
            <div id="third-example">Hello World</div>
        </body>
        </html>
    `;

    const result = strainCssHtml(cssBody, htmlBody, '-', 4, 'prefix', 1);

    it('Check CSS structure', () => {
        expect(result.css).to.have.property('cssMaps').that.is.an('array').with.lengthOf(3);
        expect(result.css).to.have.property('selectors').that.is.an('array').with.lengthOf(3);
        expect(result.css).to.have.property('notSelectors').that.is.an('array').with.lengthOf(1);
        expect(result.css).to.have.property('css').that.is.a('string');
    });

    it('Check if the CSS was processed correctly', () => {
        expect(result.css.css).to.match(/body {\s*color: black;\s*background-color: silver;\s*padding: 10px;\s*}/);
        expect(result.css.css).to.match(/\.-prefix-v1-\w{4}-example {\s*color: red;\s*}/);
        expect(result.css.css).to.match(/\.-prefix-v1-\w{4}-second-example {\s*color: green;\s*}/);
        expect(result.css.css).to.match(/#-prefix-v1-\w{4}-third-example {\s*color: blue;\s*}/);
    });

    it('Check if the HTML was processed correctly', () => {
        expect(result.html).to.be.a('string');
        expect(result.html).to.match(/<h1 class="-prefix-v1-\w{4}-example">Hello World<\/h1>/);
        expect(result.html).to.match(/<div class="-prefix-v1-\w{4}-second-example">Hello World<\/div>/);
        expect(result.html).to.match(/<div id="-prefix-v1-\w{4}-third-example">Hello World<\/div>/);
    });
});
