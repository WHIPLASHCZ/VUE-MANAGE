import axios from 'axios';
// axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1';
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/';
function getPowerList(type){
        return axios.get(`rights/${type}`);
}

function getRoleList(){
    return axios.get(`roles`);
}


// - 请求路径：roles
// - 请求方法：post
// - 请求参数

// | 参数名   | 参数说明 | 备注     |
// | -------- | -------- | -------- |
// | roleName | 角色名称 | 不能为空 |
// | roleDesc | 角色描述 | 可以为空 |

function addRole({roleName,roleDesc}){
    return axios.post(`roles`,{
        roleName,roleDesc
    });
}

// ### 1.5.4. 编辑提交角色

// - 请求路径：roles/:id
// - 请求方法：put
// - 请求参数

// | 参数名   | 参数说明 | 备注                  |
// | -------- | -------- | --------------------- |
// | :id      | 角色 ID  | 不能为空`携带在url中` |
// | roleName | 角色名称 | 不能为空              |
// | roleDesc | 角色描述 | 可以为空              |
function editRole({roleId,roleName,roleDesc}){
    return axios.put(`roles/${roleId}`,{
        roleName,
        roleDesc
    })
}

// ### 1.5.3. 根据 ID 查询角色

// - 请求路径：roles/:id
// - 请求方法：get
// - 请求参数

// | 参数名 | 参数说明 | 备注                  |
// | ------ | -------- | --------------------- |
// | :id    | 角色 ID  | 不能为空`携带在url中` |

// - 响应参数

// | 参数名   | 参数说明 | 备注 |
// | -------- | -------- | ---- |
// | roleId   | 角色 ID  |      |
// | roleName | 角色名称 |      |
// | roleDesc | 角色描述 |      |

function searchRole(id){
    return axios.get(`roles/${id}`);
}

// ### 1.5.5. 删除角色

// - 请求路径：roles/:id
// - 请求方法：delete
// - 请求参数

// | 参数名 | 参数说明 | 备注                  |
// | ------ | -------- | --------------------- |
// | :id    | 角色 ID  | 不能为空`携带在url中` |

function deleteRole(id){
    return axios.delete(`roles/${id}`);
}

function removeRight(roleId,rightId){
    return axios.delete(`roles/${roleId}/rights/${rightId}`);
}

function getAllRight(type){
    return axios.get(`rights/${type}`);
}

function changeRight(roleId,rids){
    return axios.post(`roles/${roleId}/rights`,{
        rids
    });
}

export {getPowerList,getRoleList,addRole, editRole,searchRole,deleteRole,removeRight,getAllRight,changeRight};