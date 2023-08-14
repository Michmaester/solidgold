import dayjs from 'dayjs'

export default (context, inject) => {

    const formatDate = (dateTime) => {
        if (typeof (dateTime) === 'undefined' || dateTime === null) {
            return null;
        }
        let tempDate = new Date(dateTime);
        tempDate.setMinutes(tempDate.getMinutes() - tempDate.getTimezoneOffset())
        tempDate = tempDate.toISOString().slice(0, 16);
        return tempDate;
    }


    const formatDateByFormat = (datetime, format) => {
        return dayjs(datetime).format(format)
    }


    const formatYesNo = (data) => {
        if (data === 1) {
            return 'Yes'
        } else {
            return 'No'
        }
    }


    const clearReactive = (object) => {
        return JSON.parse(JSON.stringify(object))
    }


    const calculateTotals = (arr_data, key) => {
        return arr_data.reduce((a, b) => +a + (+convertStringToFloat(b[key]) || 0), 0).toFixed(2)
    }

    const setObjectPropNull = (obj, val) => {
        // Object.keys(obj).forEach(k => obj[k] = val);

        for (var i in obj) {
            if (typeof obj[i] === "object" && !Array.isArray(obj[i])) {
                setObjectPropNull(obj[i], val);
            }
            else {
                obj[i] = val;
            }
        }
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

    const formatAmount = (amount, decimalPlace = 2) => {

        if (!amount) {
            amount = 0
        }

        if (typeof amount == 'string') {
            amount = parseFloat(amount)
        }

        return amount.toFixed(decimalPlace).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')


    }


    const convertStringToFloat = (amount) => {
        if (!amount) amount = '0'
        if (typeof amount === 'number') amount = amount.toFixed(2)
        return parseFloat(amount.replace(',', ''))
    };



    const checkPropValueEqual = (arr_data, prop, value) => {

        let mapped = arr_data.map((item) => {
            return item[prop]
        })

        return mapped.every((item) => item === value)
    }

    // support multiple prop for future
    const mapArraySingleProp = (arr_data, prop) => {

        return arr_data.map((item) => {
            return item[prop]
        })
    }


    const RenderColorStatus = (status, option) => {
        let result = null

        switch (status) {
            case 'Pending':
                result = option == 'bg' ? 'bg-red-600' : 'text-red-600'
                break;

            case 'In-Transit':
                result = option == 'bg' ? 'bg-blue-600' : 'text-blue-600'
                break;

            case 'Delivered':
                result = option == 'bg' ? 'bg-green-600' : 'text-green-600'
                break;


            case 'Retail':
                result = option == 'bg' ? 'bg-blue-600' : 'text-blue-600'
                break;

            case 'Wholesale':
                result = option == 'bg' ? 'bg-orange-600' : 'text-orange-600'
                break;

            // Payment status
            case 'Paid':
                result = option == 'bg' ? 'bg-green-600' : 'text-green-600'
                break;

            case 'Unpaid':
                result = option == 'bg' ? 'bg-red-600' : 'text-red-600'
                break;

            case 'Partial':
                result = option == 'bg' ? 'bg-orange-600' : 'text-orange-600'
                break;

            // PO receive status
            case 'Fullfilled':
                result = option == 'bg' ? 'bg-green-600' : 'text-green-600'
                break;

            case 'Over':
                result = option == 'bg' ? 'bg-red-600' : 'text-red-600'
                break;

            default:
                result = null
                break;


        }

        return result
    }



    const isObjEmpty = (obj) => {
        return Object.keys(obj).length === 0;
    }





    // ----> inject the methods

    inject('clearReactive', clearReactive)
    inject('calculateTotals', calculateTotals)
    inject('setObjectPropNull', setObjectPropNull)
    inject('RenderColorStatus', RenderColorStatus)

    inject('checkPropValueEqual', checkPropValueEqual)
    inject('mapArraySingleProp', mapArraySingleProp)

    inject('formatDate', formatDate)
    inject('formatDateByFormat', formatDateByFormat)

    inject('formatAmount', formatAmount)
    inject('formatAmountCurrency', formatAmountCurrency)
    inject('convertStringToFloat', convertStringToFloat)


    inject('formatYesNo', formatYesNo)

    inject('isObjEmpty', isObjEmpty)



}