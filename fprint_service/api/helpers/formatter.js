const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const util = require('util')
const Handlebars = require('handlebars')
const ReadFile = util.promisify(fs.readFile)
const WriteFile = util.promisify(fs.writeFile)
const crypto = require('crypto');
const dayjs = require('dayjs')

const SalesTransactions = require('../models/sales/sales_transactions')

const ReportQuery = require('./report_queries')



const queryFilters = (params, query) => {

    const filters = []

    if (params.hasOwnProperty('filters')) {
        for (const filter of params.filters) {
            filters.push(JSON.parse(filter))
        }
    }

    //process parameters
    for (const filter of filters) {

        if (filter.field && filter.value) {

            //sanitize value
            if (filter.type === 'like') {
                query.where(filter.field, filter.type, '%' + filter.value + '%')
            } else {
                query.where(filter.field, filter.type, filter.value)
            }
            //console.log('filter okay --> ' + filter.value)
        } else {
            //console.log('filter not good')
        }
    }

    //pagination
    if (params.page) query.page(parseInt(params.page) - 1, params.pageSize)
    if (params.sort_by) query.orderBy(params.sort_by, params.sort_order)

    return query
}


const calculateTotals = (arr_data, key) => {
    return arr_data.reduce((a, b) => +a + (+convertStringToFloat(b[key]) || 0), 0).toFixed(2)
}

// const setObjectPropNull = (obj, val) => {
//     Object.keys(obj).forEach(k => obj[k] = val);
// }


// const formatAmountCurrency = (amount) => {

//     if (!amount) {
//         amount = 0
//     }

//     if (typeof amount == 'string') {
//         amount = parseFloat(amount)
//     }
//     return 'PHP' + ' ' + amount.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')

// }

const formatAmount = (amount) => {

    if (!amount) {
        amount = 0
    }

    if (typeof amount == 'string') {
        amount = parseFloat(amount)
    }
    return amount.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')

}

const formatAmountCurrency = (amount) => {

    if (!amount) {
        amount = 0
    }

    if (typeof amount == 'string') {
        amount = parseFloat(amount)
    }
    return 'PHP' + ' ' + amount.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')

}


const convertStringToFloat = (amount) => {
    if (!amount) amount = '0'
    if (typeof amount === 'number') amount = amount.toFixed(2)
    return parseFloat(amount.replace(',', ''))
}


const processReportTemplate = async (params) => {

    // Read columns of the selected report on the json file
    const jsoncolumns = JSON.parse(await ReadFile('.' + '/public/report_templates/reportcolumns.json', 'utf8'))

    // Filter it base on the report code
    const jcolumn = jsoncolumns.find((item) => { return item.module === params.rept_code })
    const query_func = jcolumn.query_func
    //const columns = jcolumn.columns

    // Decide on how to query base on the selected report code
    let datas = await ReportQuery[query_func](params, params.filters)
    //let datas = await ReptQuerySalesByCustomerSummary(columns)

    // Calculate the totals if have base on the columns
    // for (let index = 0; index < columns.length; index++) {
    //     if (columns[index].totals) {
    //         var total = formatAmount((calculateTotals(datas, columns[index].prop)))
    //         columns[index]['total'] = total
    //     }
    // }


    // Generate the filename here base on rept_code + hash
    var current_date = (new Date()).valueOf().toString();
    var random = Math.random().toString();
    const hash = crypto.createHash('sha1').update(current_date + random).digest('hex');

    let rept_filename = 'report-' + params.rept_code + '-' + hash

    report_meta = {
        title: params.rept_title,
        date_filter: params.report_dateperiod,
        generation_date: dayjs().format('MMM-DD-YYYY HH:mm:ss'),
        branch: params.branch.name,
        filename: rept_filename,
        template: params.rept_tpl
    }

    if (params.branch.branch_code === 'SG') {
        report_meta['company_name'] = 'SOLIDGOLD MULTI RESOURCE CORP.'
        report_meta['address'] = 'Brgy. Our Lady of Lourdes, Jaro Iloilo City'
        report_meta['contact'] = 'Phone No. Tel Nos. 320-2563 Fax No. Fax 509-0880'
    }

    if (params.branch.branch_code === 'EG') {
        report_meta['company_name'] = 'EVERGOLD BUILDER SALES CENTER'
        report_meta['address'] = 'Quezon St., Iloilo City'
        report_meta['contact'] = 'Phone No. Tel Nos. 320-2563 Fax No. Fax 509-0880'
    }

    if (params.branch.branch_code === 'GM') {
        report_meta['company_name'] = 'GOLDMASTER HOME CREATION'
        report_meta['address'] = 'Guzman St., Mandurriao Iloilo City'
        report_meta['contact'] = 'Phone No. Tel Nos. 321-0281 Fax No. Fax 321-5230'
    }

    if (params.branch.branch_code === 'HM') {
        report_meta['company_name'] = 'HOMEMASTER'
        report_meta['address'] = 'Brgy. Our Lady of Lourdes, Jaro Iloilo City'
        report_meta['contact'] = 'Phone No. Tel Nos. 320-2563 Fax No. Fax 509-0880'
    }

    let reportdata = {
        meta: report_meta,
        // columns: columns,
        datas: datas
    }

    return reportdata
}



module.exports = {
    calculateTotals,
    formatAmount,
    formatAmountCurrency,
    processReportTemplate,
    queryFilters
}