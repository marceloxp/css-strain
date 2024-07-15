const fs = require('fs');
const { strainCssHtml } = require('../index');

describe('strainCssHtml', async () => {
    let expect;
    before(async function () {
        ({ expect } = await import('chai'));
    });

    try {
        const cssBody = fs.readFileSync('./test/style.css', 'utf8');
        const htmlBody = fs.readFileSync('./test/index.html', 'utf8');
    
        const options = {
            cssBody,
            htmlBody,
            addHelpers: true,
            separator: '_',
            randomLength: 4,
            prefix: 'prefix',
            version: 1
        };

        const result = strainCssHtml(options);

        const newCssBody = result.css.css;
        const newHtmlBody = result.html;

        console.log('\nnewCssBody:');
        console.log('--------------------------------------------');
        console.log(newCssBody);
        console.log('\nnewHtmlBody:');
        console.log('--------------------------------------------');
        console.log(newHtmlBody);

        it('Check CSS structure', () => {
            expect(result.css).to.have.property('cssMaps').that.is.an('array');
            expect(result.css).to.have.property('selectors').that.is.an('array');
            expect(result.css).to.have.property('notSelectors').that.is.an('array');
            expect(result.css).to.have.property('css').that.is.a('string');
        });

        it('Check if the CSS was processed correctly', () => {
            expect(result.css.css).to.match(/\.prefix_v1_\w{4}_example {\s*color: red;\s*}/);
            expect(result.css.css).to.match(/\.prefix_v1_\w{4}_example {\s*color: blue;\s*}/);
            expect(result.css.css).to.match(/\.prefix_v1_\w{4}_second-example {\s*color: green;\s*}/);
            expect(result.css.css).to.match(/#prefix_v1_\w{4}_third-example {\s*color: blue;\s*}/);
        });

        it('Check if the HTML was processed correctly', () => {
            expect(result.html).to.be.a('string');
            expect(result.html).to.match(/<h1 class="prefix_v1_\w{4}_example" data-strain-class="\[example\]">Hello World Example<\/h1>/);
            expect(result.html).to.match(/<div id="prefix_v1_\w{4}_only-id" class="prefix_v1_\w{4}_only-class prefix_v1_\w{4}_another-only-class" data-strain-id="only-id" data-strain-class="\[only-class\]\[another-only-class\]">Only ID and Only Class<\/div>/);
            expect(result.html).to.match(/<div class="prefix_v1_\w{4}_second-example prefix_v1_\w{4}_another-example" data-strain-class="\[second-example\]\[another-example\]">Second and Another Example<\/div>/);
            expect(result.html).to.match(/<div class="prefix_v1_\w{4}_another-example" data-strain-class="\[another-example\]">Another Example<\/div>/);
            expect(result.html).to.match(/<div id="prefix_v1_\w{4}_third-example" data-strain-id="third-example">Third Example<\/div>/);
        });
    } catch (error) {
        console.error(error);
    }
});
