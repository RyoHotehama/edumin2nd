import Axios from 'axios';

 const axios = Axios.create({
     baseURL: process.browser ? 'http://localhost' : 'http://api:80',
     headers: {
         'X-Requested-With': 'XMLHttpRequest',
     },
     withCredentials: true,
 })

 export default axios