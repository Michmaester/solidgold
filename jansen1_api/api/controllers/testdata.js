//const PlantModel = require('../models/Plant')
const TestData = require('../models/testdatas')
var faker = require('faker')

const Helpers = require('../utils/helpers')


const GetTestDatas = async function (params) {
    try {

        let query = TestData.query()

        query = Helpers.queryFilters(params, query)

        if (params.page) query.page(parseInt(params.page) - 1, params.pageSize)

        if (params.sort_by) query.orderBy(params.sort_by, params.sort_order)


        const query_results = await query
        return query_results

    } catch (error) {
        console.log(error)
    }
}

const GenerateFakeDatas = async function () {
    try {


        const counter = 300000

        for (let index = 0; index < counter; index++) {

            await TestData.query().insert({
                name: faker.name.firstName(),
                email: faker.internet.email(),
                address: faker.address.city(),
                remarks: faker.git.commitMessage()
            })
        }

        return true

    } catch (error) {
        console.log(error)
    }
}



module.exports = {
    GetTestDatas,
    GenerateFakeDatas
}