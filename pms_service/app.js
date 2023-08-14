const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()


const routes = require('./api/routes')








/* ======================================

	Express + Handlebar Configs

=======================================*/
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))





/* init routes */
app.use('/employees', routes.employees)
app.use('/fingerprints', routes.fingerprints)

app.use('/tests', routes.tests)

app.use('/dtrs', routes.dtrs)
app.use('/dtls', routes.dtls)
app.use('/payrolls', routes.payrolls)





app.get('/', async (req, res, next) => {
	try {

		res.status(200).json({
			status: 'ok',
			message: 'You have reached this endpoint. Server is working.',
			data: {
				port: process.env.SERVER_PORT
			}
		})
	} catch (error) {
		next(error)
	}
})








// Error Handlers for the unspecified routes and other system wide errors

app.use((req, res, next) => {
	let error = new Error('Not Found')
	error.statusCode = 404
	next(error)
})

app.use((error, req, res, next) => {
	// res.status(error.status || 500);
	res.json({
		status: 'server_error',
		message: error.message,
	})
})



module.exports = app
