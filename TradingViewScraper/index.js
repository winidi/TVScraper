const puppeteer = require('puppeteer');
const fs = require('fs');
require('dotenv').config()

const filePath = './IndicatorData/indicatorData.txt'
const selectEmail = '#overlap-manager-root > div > div.tv-dialog__modal-wrap.tv-dialog__modal-wrap--contain-size > div > div > div > div > div > div > div:nth-child(1) > div.i-clearfix > div > span'
const closePaperTrading = '#overlap-manager-root > div > div > div.wrap-2qEpRlNG > div > div > div.broker-login.dialog-1fGT2JpL.dialog-2qEpRlNG.dialog-UM6w7sFp.rounded-UM6w7sFp.shadowed-UM6w7sFp > div.header-1fGT2JpL > span > svg'

const EMAIL = process.env.EMAIL
const PASSWORD = process.env.PASSWORD

let userNameId = '';
let passwordId = '';
let signInButton = '';

main();

async function main() {

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://www.tradingview.com/#signin');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });

    wait(3000)
    await page.click(selectEmail);
    wait(3000)

    // Find id's for Login
    try {
        const userNameEmailArr = await page.$$eval('[id^="email-signin__user-name"]', elms => elms.map(elm => elm.id));
        userNameId = '#' + userNameEmailArr[0].toString();
        console.log(userNameId)
        const passwordArr = await page.$$eval('[id^="email-signin__password-input"]', elms => elms.map(elm => elm.id));
        passwordId = '#' + passwordArr[0].toString();
        console.log(passwordId)
        const signInButtonArr = await page.$$eval('[id^="email-signin__submit-button"]', elms => elms.map(elm => elm.id));
        signInButton = '#' + signInButtonArr[0].toString();

    } catch (error) {
        console.log('error fetching Id`s')
    }

    await page.click(userNameId);
    await page.keyboard.type(process.env.EMAIL);
    await page.click(passwordId);
    await page.keyboard.type(process.env.PASSWORD);

    wait(3000)

    await page.click(signInButton)

    wait(3000)

    await page.goto('https://www.tradingview.com/chart/');

    wait(3000);


    try {
        await page.click(closePaperTrading)
    } catch (error) {
        console.log('No Paper trading prompt found')
    }

    wait(3000)

    updateData();
}

async function updateData() {

    try {

        const indicatorValues = await page.$$eval('[class^="valueValue"]', elms => elms.map(elm => elm.innerHTML));

        indicatorValuesCSV = '\n';
        let firstLoop = true;
        
        for (let i = 0; i < indicatorValues.length; i++) {
            const element = indicatorValues[i].toString();

            if (firstLoop) {
                indicatorValuesCSV = indicatorValuesCSV + element.toString();
                firstLoop = false;
            } else {
                indicatorValuesCSV = indicatorValuesCSV + ';' + element.toString();
            }
        }
        console.timeEnd("save");

        const LogStream = fs.createWriteStream(filePath, { flags: 'a' });
        LogStream.end(indicatorValuesCSV)

    } catch (error) {
        console.log('error getting indicator values')
    }
    
    let timeOutVar = setTimeout(updateData, 1000);
}

function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}