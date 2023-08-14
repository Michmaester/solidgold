/*
 © Copyright 2021 mecssolutions.com
 * Author : Ralph Tan Ceriaco
 * 
 * You are not allowed to distribute the codes below.
*/


/* Declare routes */
const employees = require('./employees')
const fingerprints = require('./fingerprints')

const dtrs = require('./daily_time_records')
const dtls = require('./daily_time_logs')
const payrolls = require('./payrolls')

const loans = require('./loans')

const tests = require('./test')



/* Expose routes on the module */
module.exports = {
    employees,
    fingerprints,

    dtrs,
    dtls,
    loans,
    payrolls,


    tests
}