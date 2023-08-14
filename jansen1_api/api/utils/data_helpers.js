const dayjs = require('dayjs')


// mapped data according to column array with opton for date format
const columnDataMapper = (columns, datas) => {
    let result = datas.map((item) => {
        let obj = {};
        columns.forEach(
            (column) =>
            (obj[column.prop] = column.hasOwnProperty("format")
                ? dayjs(getValueByPath(item, column.field)).format(column.format)
                : getValueByPath(item, column.field))
        );
        return obj;
    });

    return result
}


const getValueByPath = (obj, path) => {
    return path.split('.').reduce((o, i) => o ? o[i] : null, obj)
}


module.exports = {
    columnDataMapper,
    getValueByPath,
}