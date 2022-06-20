const {Schema, model} = require('mongoose')

const schema = new Schema ({
	userId: {type: String, required: true},
	assistId: {type: String},
	username: {type: String, required: true},
	club: {type: String, required: true},
	place: {type: Number},
	bidStatus: {type: String, default: 'closed'},
	coeff: {type: Number},
	money: {type: Number},
	players: {type: Number},
	password: {type: String, default: ''},
})

module.exports = model('User', schema)