import axios from 'axios';
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1';
// axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/';

export function getOrders({query,pagenum,pagesize}){
        return axios.get(`orders`,{
            params:{
                query,pagenum,pagesize
            }
        })
}

export function editAddr(id){
    return axios.get(`kuaidi/${id}`);
}