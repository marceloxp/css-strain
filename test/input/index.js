async function main() {
    const element = document.querySelectorAll(getStrainSelector('#only-id.only-class'));
    console.log("🚀 ~ main ~ element:", element)
}

document.addEventListener('DOMContentLoaded', () => {
    main();
});