
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


module.exports = {
    queryFilters
}