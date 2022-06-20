const axios = require('axios')

export default function roundUpdate (command, roundNumber, handleRoundUpdate) {

	if (command === 'start') {
        // Параметры вебхука
		const params = {
			username: "Miles Jacobson Jr.",
			avatar_url: "https://pbs.twimg.com/media/Dy5aICuW0AAJn5x.jpg",
			content: `▶️ Раунд ${roundNumber} запущен! Делайте ваши ставки!` 
        }

		axios.post('api/roundstart')
			.then((res) => {
				handleRoundUpdate('open', roundNumber)
                
				axios({
					method: 'post',
					url: process.env.REACT_APP_DISCORD_WEBHOOK_START,
					headers: {"Content-Type": "application/json"},
					data: params
				})
				console.log(res.data.msg)
			})
            .catch(err => {
                console.log(err)
            })
	
	} else if (command === 'finish') {
        // Параметры вебхука
		const params = { 
			username: "Miles Jacobson Jr.",
			avatar_url: "https://pbs.twimg.com/media/Dy5aICuW0AAJn5x.jpg",
			content: `!round ${roundNumber} end` 
        }

		axios.post('api/roundfinish')
			.then((res) => {
				handleRoundUpdate('closed', roundNumber+1)
				axios({
					method: 'post',
					url: process.env.REACT_APP_DISCORD_WEBHOOK_END,
					headers: {"Content-Type": "application/json"},
					data: params
				})
				console.log(res.data.msg)
			})
            .catch(err => {
                console.log(err)
            })

	} else console.log(`error: Command >${command} does not exists`)

}