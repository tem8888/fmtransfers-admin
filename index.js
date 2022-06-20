const express = require('express')
const app = express()
const path = require('path')

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const mongoose = require('mongoose')
require('dotenv/config')

const PORT = process.env.PORT || 5000
const apiRoutes = require('./routes/api')

function start() {
    try {
		mongoose.connect(process.env.MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		})
  
		app.use(express.json({}))
		app.use(express.urlencoded({extended: false}))
	
		app.use('/api', apiRoutes)
	
		if (process.env.NODE_ENV === 'production') {
			app.use(express.static(path.join(__dirname, '/client/build')))
			app.get('*', (req, res) => {
			res.sendFile(path.join(__dirname + '/client/build/index.html'))
			})
		}

		io.on('connection', (socket) => {
			console.log('a user connected: ', socket.id);

			socket.on('userid', (userId) => {
				console.log('ID: ' + userId);
			});

			socket.on('disconnect', () => {
				console.log('user disconnected');
			});
		});

		app.use('/discord', (req, res, next) => {
			io.sockets.emit('discord', req.body.userId);
			res.json({msg: 'gotcha!'})
			next()
		})

		server.listen(PORT, () => {
			console.log(`App has been started on port ${PORT}...`)
		})
	} 
	catch (e) {
		console.log('Server Error', e.message)
		process.exit(1)
	}
    module.exports = app
}

start()