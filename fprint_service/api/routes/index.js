/*
 © Copyright 2021 mecssolutions.com
 * Author : Ralph Tan Ceriaco
 * 
 * You are not allowed to distribute the codes below.
*/


/* Declare routes */
const employees = require('./employees')
const fingerprints = require('./fingerprints')



/* Expose routes on the module */
module.exports = {
    employees,
    fingerprints
}