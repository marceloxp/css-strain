async function main() {
    const selector_1 = getStrainSelector('#only-id.only-class');
    console.log("🚀 ~ getStrainSelector('#only-id.only-class'):", selector_1);

    const element_1 = strainGetElementById('only-id');
    console.log("🚀 ~ strainGetElementById('only-id'):", element_1);

    const element_2 = strainQuerySelector('.another-example');
    console.log("🚀 ~ strainQuerySelector('.another-example'):", element_2);

    const element_3 = strainQuerySelectorAll('.another-example');
    console.log("🚀 ~ strainQuerySelectorAll('.another-example'):", element_3);

    const element_4 = strainQuerySelectorAll('.first-section .another-example');
    console.log("🚀 ~ strainQuerySelectorAll('.first-section .another-example'):", element_4);
}

document.addEventListener('DOMContentLoaded', () => {
    main();
});
