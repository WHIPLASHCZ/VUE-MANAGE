import axios from 'axios';
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1';
const baseURL = 'https://www.liulongbin.top:8888/api/private/v1';
function login(username,password){
   let url = 'https://www.liulongbin.top:8888/api/private/v1/login';
    return axios.post('/login',{
            username,
            password
    })
}

export {login}