require('dotenv').config()
const http = require('http')
const app = require('./app')
const cron = require('node-cron')
const dayjs = require('dayjs')

const DailyChecker = require('./api/services/daily_checker')

const port = process.env.SERVER_PORT

const server = http.createServer(app)



server.listen(port, () => {
	console.log(`Server is running on port ${port}.`)
})


// run every 5 hours
cron.schedule('0 */5 * * *', () => {

	// DailyChecker.ProcessDailyStatistics()
	// DailyChecker.ProcessRestockingsAndPayables()
	
	//put some logger here
	let datetime = dayjs().format('MMM DD, YYYY HH:mm:ss')
	console.log('cron is runned.. ' + datetime)
})


// run every 30 minutes
cron.schedule('*/30 * * * *', () => {

	// check and delete public/html + public pdf files here using find-remove

	DailyChecker.DeleteOldFiles('./public/htmls', 1800, '.html')
	DailyChecker.DeleteOldFiles('./public/pdfs', 1800, '.pdf')
})