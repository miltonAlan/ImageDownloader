const puppeteer = require('puppeteer');
const fs = require('fs');

var imagesFolder = './images';
var targetPage = 'https://wallpaperset.com/metal-music-wallpaper';
var downloadLinks = [];

// crea la carpeta si no existe
if (!fs.existsSync(imagesFolder)) {
    fs.mkdirSync(imagesFolder);
}

async function scrollToBottom() {
    await new Promise(resolve => {
        const distance = 500; // should be less than or equal to window.innerHeight
        const delay = 100;
        const timer = setInterval(() => {
            document.scrollingElement.scrollBy(0, distance);
            if (document.scrollingElement.scrollTop + window.innerHeight >= document.scrollingElement.scrollHeight) {
                clearInterval(timer);
                resolve();
            }
        }, delay);
    });
}
async function main() {
    const browser = await puppeteer.launch({
        headless: true
    });

    const page = (await browser.pages())[0];
    await page.goto(targetPage);

    await page.evaluate(scrollToBottom);

    downloadLinks = await page.evaluate(() => Array.from(document.querySelectorAll("img[class='isWiden thumb tothemoon']"), element => element.getAttribute('data-download')));

    console.log(downloadLinks.length);

    downloadLinks.forEach(element => {
        console.log(element);
    });

    await browser.close();
}

main();