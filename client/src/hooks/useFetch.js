import {useState, useEffect} from 'react'
import axios from 'axios'

export const useFetch = (url1, url2) => {
    const [usersData, setUsersData] = useState([]) 
    const [round, setRound] = useState({number: 1, status: 'closed'})
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
      (async function(){
        const users = await axios.get(url1)
        const settings = await axios.get(url2)
        setUsersData(users.data)
        setRound({number: settings.data[0].activeRound, status: settings.data[0].roundStatus})
        setIsLoading(false)
      })()
    },[url1, url2])

    return [round, setRound, usersData, setUsersData, isLoading]
}