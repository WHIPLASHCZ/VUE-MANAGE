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
// id为第三级分类的id。sel为字符串only或many only为静态属性 many为动态参数
export function getParams(id,sel){
    return axios.get(`categories/${id}/attributes`,{
        params:{
            sel
        }
    })
}

export function addParams(id,attr_name,attr_sel,attr_vals){
    return axios.post(`categories/${id}/attributes`,{
        attr_name,
        attr_sel,
        attr_vals
    })
}
// 分类ID，属性ID，only/many，可选参数
export function searchParams(id,{attr_id,attr_sel,attr_vals}){
    return axios.get(`categories/${id}/attributes/${attr_id}`,{
        params:{
            attr_sel,
            attr_vals
        }
    })
}

export function editParam(id,attr_name,{attr_id,attr_sel},attr_vals){
    return axios.put(`categories/${id}/attributes/${attr_id}`,{
            attr_name,
            attr_sel,
            attr_vals
    })
}

export function deleteParam(id,attr_id){
    return axios.delete(`categories/${id}/attributes/${attr_id}`);
}

export function getGoods({query,pagenum,pagesize}){
    return axios.get(`goods`,{
        params:{
            query,
            pagenum,
            pagesize
        }
    })
}

export function deleteGood(id){
    return axios.delete(`goods/${id}`);
}

export function addGood(form){
    return axios.post('goods',form)
}

// ### 1.8.3. 根据 ID 查询商品

// - 请求路径：goods/:id
// - 请求方法：get
// - 请求参数

// | 参数名 | 参数说明 | 备注                  |
// | ------ | -------- | --------------------- |
// | id     | 商品 ID  | 不能为空`携带在url中` |

export function searchGood(id){
    return axios.get(`goods/${id}`);
}

export function editGood(id,{goods_name,goods_price,goods_number,goods_weight,goods_introduce,goods_cat}){
        return axios.put(`goods/${id}`,{
            goods_name,goods_price,goods_number,goods_weight,goods_introduce,goods_cat
        })
}

// export function getCateList