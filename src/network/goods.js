import axios from 'axios';
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1';
// axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/';

export function getCategories({type,pagenum,pagesize}){
        return axios.get('/categories',{
            params:{
                type,
                pagenum,
                pagesize
            }
        })
}

export function addCate({cat_pid,cat_name,cat_level}){
    return axios.post(`/categories`,{
        cat_pid,cat_name,cat_level
    })
}

// export function getCateList