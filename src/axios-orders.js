import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://spa-data.firebaseio.com/'
})

export default instance