const dayjs = require('dayjs');
const Users = require('../models/users');
const UserLogs = require('../models/user_logs');


async function LoggedEvent(trx, data) {

    // data = object
    // trx

    await UserLogs.query(trx)
        .insert({
            event: data.event,
            event_datetime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            user_id: data.user_id,
            branch_code: data.branch_code
        })

    return true
}




module.exports = {
    LoggedEvent
}