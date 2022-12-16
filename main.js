const fs = require('fs')
const puppeteer = require('puppeteer-extra')

const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(AdblockerPlugin({ blockTrackers: true }))

puppeteer.launch({ headless: true, executablePath: require('puppeteer').executablePath() }).then(async (browser) => {

    const page = await browser.newPage()
    await page.setViewport({ width: 800, height: 600 })

    const biggo = [];

    for (let index = 1; index < 106; index++) {
      
        console.log(`Scraping uwu`)
        let url = 'https://www.albumoftheyear.org/ratings/57-the-needle-drop-highest-rated/all/'+index

        // console.log(url);
        await page.goto(url)
        x = Math.round(Math.random() * (10000 - 5000) + 5000)
        await page.waitForTimeout(x)
      
        // DO STUFF
        const albums = await page.evaluate(() => 

          Array.from(document.querySelectorAll('.albumListRow'), (e) => (
            {
              artist: e.querySelector('h2 span a').innerText.split(/\s*\-\s*/g)[0],
              title: e.querySelector('h2 span a').innerText.split(/\s*\-\s*/g)[1],
              score: parseInt(e.querySelector('.albumListScoreContainer .scoreValueContainer .scoreValue').innerText)/10,
              ...(e.querySelector('.albumListDate') != null ? {date: e.querySelector('.albumListDate').innerText} : {date: 'No Date'}),
              ...(e.querySelector('.albumListGenre a') != null ? {genre: e.querySelector('.albumListGenre a').innerText} : {genre: 'No Genre'})
            }
          ))
        );

        biggo.push(albums);
      
    }

    await browser.close()

    fs.writeFile('master.json', JSON.stringify(biggo), (err) => {
        if (err) throw err;
        console.log('Archivo guardado')
    })

})