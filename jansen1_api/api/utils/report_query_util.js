const calculateTotals = (arr_data, key) => {
    return arr_data.reduce((a, b) => +a + (+convertStringToFloat(b[key]) || 0), 0).toFixed(2)
}

const convertStringToFloat = (amount) => {
    if (!amount) amount = '0'
    if (typeof amount === 'number') amount = amount.toFixed(2)
    return parseFloat(amount.replace(',', ''))
}

const formatAmount = (amount, decimalPlace = 2) => {

    if (!amount) {
        amount = 0
    }

    if (typeof amount == 'string') {
        amount = parseFloat(amount)
    }
    return amount.toFixed(decimalPlace).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')

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


const sumArrays = (arrs) => {

    return arrs.reduce((a, b) => +a + (+b || 0), 0).toFixed(2)

}




module.exports = {
    calculateTotals,
    formatAmount,
    formatAmountCurrency,
    sumArrays
}