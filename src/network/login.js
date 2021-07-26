import axios from 'axios';
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1';
// axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/';
const baseURL = 'https://www.liulongbin.top:8888/api/private/v1';
function login(username,password){
    return axios.post('/login',{
            username,
            password
    })
}

function getMenu(){
        return axios.get('/menus');
}

function getUserlist({query,pagenum,pagesize}){
        return axios.get('/users',{
               params:{
                query,
                pagenum,
                pagesize
               }
        })
}

function changeUserState({id,mg_state}){
        return axios.put(`/users/${id}/state/${mg_state}`,{
        })
}

function addUser({username,password,email,mobile}){
        return axios.post('/users',{
                username,
                password,
                email,
                mobile
        })
}

function search(id){
        return axios.get(`/users/${id}`);
}

function changeUser({id,email,mobile}){
        return axios.put(`/users/${id}`,{
                email,
                mobile
    });
}

function deleteUser(id){
        return axios.delete(`/users/${id}`);
}

function changeUserRole(id,rid){
        return axios.put(`/users/${id}/role`,{rid});
}




// 请求拦截器 在请求头中添加Authorization字段 除登陆外其他接口均需要该字段才能请求成功。
axios.interceptors.request.use((config)=>{
        config.headers.Authorization = sessionStorage.getItem('token');
        return config
})

export {login,getMenu,getUserlist, changeUserState,addUser,search,changeUser,deleteUser,changeUserRole}