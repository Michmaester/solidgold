require('dotenv').config({ path: 'configs/.env' })
const http = require('http')
const app = require('./app')



const port = process.env.SERVER_PORT
const server = http.createServer(app)

server.listen(port, () => {
	console.log(`Server is running on port ${port}.`)
})