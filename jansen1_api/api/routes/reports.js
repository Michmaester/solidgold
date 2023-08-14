const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const util = require('util')
const Handlebars = require('handlebars')
const ReadFile = util.promisify(fs.readFile)
const WriteFile = util.promisify(fs.writeFile)


// use puppeteer here
const Puppeteer = require('puppeteer');
const dayjs = require('dayjs')








const Helpers = require('../utils/helpers')



router.get('/', async (req, res, next) => {

    try {

        // experiement

        // var columns = [
        //     { field: 'id', label: 'ID' },
        //     { field: 'prod', label: 'Product' },
        //     { field: 'desc', label: 'Description' },
        //     { field: 'amount', label: 'Amount', totals: true },
        //     { field: 'discount', label: 'Discount' }
        // ]

        // var datas = [
        //     { id: '1', prod: 'Inte i5 Proc', desc: 'i5 Processsor', amount: '220.00', discount: '1' },
        //     { id: '2', prod: 'Inte i3 Proc', desc: 'i3 Processsor', amount: '20.00', discount: '3.3' },
        //     { id: '3', prod: 'Inte i7 Proc', desc: 'i7 Processsor', amount: '1,220.60', discount: '1.5' }
        // ]4

        // //inject the totals
        // for (let index = 0; index < columns.length; index++) {
        //     const element = columns[index]

        //     if (columns[index].totals) {
        //         var total = parseFloat(Helpers.calculateTotals(datas, columns[index].field))
        //         columns[index]['total'] = total
        //     }
        // }

        // let report_meta = {
        //     title: 'Test Report',
        //     desc: 'Test report description',
        //     date_filter: 'Aug 01, 2020 to Oct 02, 2020',
        //     generation_date: dayjs().format('MM-DD-YYYY HH:mm:ss'),
        //     company: 'SolidGold',
        //     branch: 'Branch1',
        //     address: 'Testing address, we display it very long',
        //     show_toolbar: true
        // }

        // let reportdata = {
        //     meta: report_meta,
        //     columns: columns,
        //     datas: datas
        // }

        //console.log(columns)


        //res.render('single', { layout: 'index', data: reportdata });
        res.render('list', { layout: 'index', data: reportdata });

    } catch (error) {
        next(error)
    }

})

router.post('/', async (req, res, next) => {

    try {

        /* 
        
            So this works like :
            1. Client give paramaters for the report
            2. Server will process its : db query and manipulaton of result // totals calculation
            3. Get the template and compile it using handlebars
            4. Save it to an html file with filename + hash
            5. Send back the html link - so client can view the report
            6. Have a toolbar --> Generate PDF with a parameter of the html filename
            7. Generate PDf using that filename using puppeteer
        
        
        */

        let payload = req.body


        payload.current_branch_code = req.headers.xbranchcode

        let reportdata = await Helpers.processReportTemplate(payload)

        let meta = reportdata.meta


        /*  Generate the HTML file form the template */
        const templatePath = path.resolve('.') + '/public/report_templates/' + meta.template + '.html'
        const content = await ReadFile(templatePath, 'utf8')
        const template = Handlebars.compile(content)
        const page = template(reportdata)

        await WriteFile(path.resolve('.') + '/public/htmls/' + meta.filename + '.html', page)

        const htmlreport = {
            url: process.env.SERVER_REPORT_URL + 'files/htmls/' + meta.filename + '.html',
            filename: meta.filename
        }

        res.status(200).json({
            status: 'ok',
            title: 'Success',
            message: 'Successfully generated report preview for the selected report.',
            data: htmlreport
        })

    } catch (error) {
        next(error)
    }

})

router.post('/generate_pdf', async (req, res, next) => {

    try {

        const payload = req.body

        //get the orientation

        const isLandscape = payload.orientation === 'landscape' ? true : false

        const htmlpage = path.resolve('.') + '/public/htmls/' + payload.filename + '.html'
        const pagecontent = await ReadFile(htmlpage, 'utf8')

        const browser = await Puppeteer.launch()
        const page = await browser.newPage()

        await page.setContent(pagecontent, { waitUntil: 'networkidle2' })

        const filename = payload.filename + '.pdf'

        await page.pdf({
            path: path.resolve('.') + '/public/pdfs/' + filename,
            format: 'A4',
            landscape: isLandscape,
            margin: {
                top: '20',
                right: '10',
                bottom: '20',
                left: '10'
            }
        })

        await browser.close();

        const pdfreport = {
            url: process.env.SERVER_REPORT_URL + 'files/pdfs/' + filename,
            filename: filename
        }

        res.status(200).json({
            status: 'ok',
            title: 'Success',
            message: 'Successfully generated PDF file for the selected report.',
            data: pdfreport
        })

    } catch (error) {
        next(error)
    }

})

module.exports = router;