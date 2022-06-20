const {Schema, model} = require('mongoose')

const schema = new Schema ({
	roundStatus: {type: String, default: 'closed', required: true},
	activeRound: {type: Number, default: 1},
})

module.exports = model('Setting', schema)