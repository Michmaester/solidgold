const express = require('express');
const router = express.Router();

const puppeteer = require('puppeteer');


router.get('/', async (req, res, next) => {

    try {

        res.send('<h1>testing data</h1>');






        // res.status(200).json({
        //     status : 'ok',
        //     data : 'test'
        // })

    } catch (error) {
        next(error)
    }

})



router.post('/', async (req, res, next) => {

    try {

        const payload = req.body

        //const meta = payload.meta

        //console.log(payload.report)


        // generate the template

        // serve it to a route




        // //generate the pdf

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const filename = 'testing.pdf'

        await page.setContent(payload.report, { waitUntil: 'networkidle2' });
        //wait page.goto('http://127.0.0.1:3100/report', { waitUntil: 'networkidle2' });

        await page.pdf({ path: 'public/pdfs/' + filename, format: 'A4' });
        await browser.close();

        console.log(filename)
        console.log('generated?')


        //req data is following
        //1. html url link
        //2. html content
        // filename of pdf should also be provided

        //generate using page.setContent

        //need to check wether
        // 1. can use the promise to tell if the pdf is already generated
        // 2. use the file system and check wether the file is present or not.

        //sendback the filename of the pdf
        //so client can autodownload it on the express server using static
        //const pdf = 'test.pdf'

        res.status(200).json({
            status: 'ok',
            data: 'test'
        })

    } catch (error) {
        next(error)
    }

})

module.exports = router;