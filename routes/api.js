const {Router} = require('express')
const router = Router()
const path = require('path')
const User = require('../models/User')
const Setting = require('../models/Setting')
const Squadlist = require('../models/Squadlist')
const Transferlist = require('../models/Transferlist')
const Bid = require('../models/Bid')
const bcrypt = require('bcryptjs')

router.get('/loadusers', async (req, res) => {
	try {
		const doc = await User.find({ }).sort({ _id: 1 }).select('-password')
		res.json(doc);
	} catch (error) {
		console.log('error: ', error);
	}
})
router.get('/loadsettings', async (req, res) => {
	try {
		const doc = await Setting.find({ }).select('-_id')
		res.json(doc);
	} catch (error) {
		console.log('error: ', error);
	}
})

router.post('/deleteuser', async (req, res) => {
	try {
		const doc = await User.findOneAndDelete(req.body)
		res.json(doc)
	} catch (error) {
		console.log('error: ', error)
	}
})

router.post('/createuser', async (req, res) => {
	try {
		const doc = await User.create(req.body)
		res.json(doc)
	} catch (error) {
		console.log('error: ', error)
	}
})

router.post('/updateuser', async (req, res) => {

	const data = req.body
	const filter = req.query
	const options = {new: true, useFindAndModify: false}
	const saltRounds = 10
	try {
		if (!data.password) {
			const doc = await User.findOneAndUpdate(filter, data, options)
			res.json(doc)
		} else {
			bcrypt.genSalt(saltRounds, function(err, salt) {
				bcrypt.hash(data.password, salt, async function(err, hash) {
					if (err) {
						console.log('Error: ', err)
					}
					data.password = hash
					const doc = await User.findOneAndUpdate(filter, data, options)
					res.json(doc)
				})
			})
		}
	} catch (error) {
		console.log('error: ', error)
	}
})

router.post('/uploadusers', async (req, res) => {
	const options = {new: true, useFindAndModify: false}
	const data = req.body
	const newData = []

	data.map( user => { // хешируем в полученных данных пароль
		bcrypt.genSalt(10, async function(err, salt) {
			user.password = await bcrypt.hash(user.password, salt)
			newData.push(user)
		})
	})
	// очищаем старую таблицу
	await User.deleteMany({})
	//заносим новые данные
	const response = await User.create(data, options)
	res.json(response);
})

router.post('/uploadsquads', async (req, res) => {
	const options = {new: true, useFindAndModify: false}
	const data = req.body

	// очищаем старую таблицу
	await Squadlist.deleteMany({})
	//заносим новые данные
	const response = await Squadlist.create(data, options)
	res.json(response);
})

router.post('/uploadtransfers', async (req, res) => {
	const options = {new: true, useFindAndModify: false}
	const data = req.body

	// очищаем старую таблицу
	await Transferlist.deleteMany({})
	//заносим новые данные
	const response = await Transferlist.create(data, options)
	res.json(response);
})

router.post('/roundstart', (req, res) => {

	Promise.all([
		User.updateMany({},	{ 
			$set: {bidStatus: 'open'} 
		}),
		Setting.updateMany({}, { 
			$set: {roundStatus: 'open'} 
		})
	]).then(_ => {
		res.json({ msg: 'Round has been started!' }); /* Возвращает только количество денег */
	}).catch(_ => {
		res.status(500).json({ msg: 'Sorry, internal server errors' });
	})
})

router.post('/roundfinish', (req, res) => {

	Promise.all([
		User.updateMany(
			{bidStatus: "open"},
			{
				$inc: {coeff: 0.2}, 
				$set: {bidStatus: 'closed'}
			}
		),
		Setting.updateMany({},{
				$inc: {activeRound: 1}, 
				$set: {roundStatus: 'closed'}
		})
	]).then(_ => {
		res.json({ msg: 'Round has been finished!' }); /*  */
	}).catch(_ => {
		res.status(500).json({ msg: 'Sorry, internal server errors' });
	})
})

/* -------------------------------------- */
/* Сброс настроек раунда и удаление всех бидов */
/* ------------------------------------ */
router.post('/reset', (req, res) => {

	Promise.all([
		Bid.deleteMany({}),
		User.updateMany({},{
			$set: {bidStatus: 'closed'}
		}),
		Setting.updateMany({},{
			$set: {activeRound: 1, roundStatus: 'closed'}
		})
	]).then(() => {
		res.json({ msg: 'Reseted!' });
	}).catch(_ => {
		res.status(500).json({ msg: 'Sorry, internal server errors' });
	})

})

// If no API routes are hit, send the React app
router.use(function(req, res) {
	res.sendFile(path.join(__dirname, '../client/public/index.html'));
});

module.exports = router
