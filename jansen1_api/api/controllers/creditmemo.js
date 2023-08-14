const PurchaseOrder = require('../models/purchase/purchase_orders')
const SalesTransactions = require('../models/sales/sales_transactions')

const CreditMemo = require('./../models/credit_memos')



const dayjs = require('dayjs')
const Helpers = require('../utils/helpers')
const Generator = require('../utils/reference_generator')

const _ = require('lodash')



const CreateCreditMemo = async (trx, payload) => {

    try {

        const newCreditMemoNo = await Generator.GenerateReference(trx, 'credit_memo')

        await CreditMemo.query(trx).insert({
            crm_no: newCreditMemoNo,
            credit_datetime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            customer_id: payload.customer_id,
            sr_no: payload.sr_no,
            invoice_no: payload.invoice_no,
            credit_amount: payload.credit_amount,
            credit_balance: payload.credit_amount,
            branch_code: payload.branch_code,
            created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            created_by: payload.user

        })

        await Generator.UpdateRunningValue(trx, 'credit_memo', newCreditMemoNo)


    } catch (error) {
        console.log(error)
    }

}


const UpdateCreditMemo = async (params) => {

    try {

        await CreditMemo.query().patch({

            credit_amount: '',
            credit_balance: '',
            updated_at: '',
            updated_by: '',

        }).where('crm_no', payload.crm_no)



    } catch (error) {
        console.log(error)
    }

}



const GetCustomerCreditMemos = async (params) => {

    try {



    } catch (error) {
        console.log(error)
    }

}












module.exports = {
    CreateCreditMemo,
    UpdateCreditMemo,
    GetCustomerCreditMemos
}