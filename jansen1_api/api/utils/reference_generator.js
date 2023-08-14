const SettingsReferences = require('../models/settings_references')



async function GenerateReference(trx, reference) {

    const result = await SettingsReferences.query(trx).findOne('ref_name', reference)

    var value = null
    var newValue = null

    if (result.running_value) {
        value = (parseInt(result.running_value) + 1).toString().padStart(result.running_value.length, 0)
    } else {
        value = (parseInt(result.starting_value)).toString().padStart(result.starting_value.length, 0)
    }

    if (result.suffix) {
        newValue = result.prefix + value + result.suffix
    } else {
        newValue = result.prefix + value
    }

    return newValue
}

async function UpdateRunningValue(trx, reference, running_value) {

    const runningValueUpdated = await SettingsReferences.query(trx)
        .findOne('ref_name', reference)
        .patch({
            running_value: running_value.replace(/[a-zA-Z]+/g, '')
        });

    return runningValueUpdated
}

function RandomNumberGenerator() {
    var timestamp = new Date().getUTCMilliseconds();

    var min = 100000;
    var max = 999999;
    var random = Math.floor(Math.random() * (+max + 1 - +min)) + +min;
    var genrandom = random + timestamp

    return genrandom
}


module.exports = {
    GenerateReference,
    UpdateRunningValue,
    RandomNumberGenerator
}