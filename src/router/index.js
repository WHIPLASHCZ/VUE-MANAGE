import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect:'login',
   
  },
  {
    path: '/login',
    name: 'login',
    component: ()=>import('../views/login/login.vue'),
    meta:{title:'登陆'}
  },
  {
    path:'/home',
    name:'home',
    component: ()=>import('../views/home/home.vue'),
    redirect:'/home/welcome',
    meta:{title:'首页'},
    children:[
      {
        path:'welcome',
        name:'welcome',
        meta:{title:'欢迎'},
        component: ()=>import('../views/home/child/users/welcome.vue'),
      },
      {
        path:'users',
        name:'users',
        meta:{title:'用户列表'},
        component: ()=>import('../views/home/child/users/users.vue'),
      },
      {
        path:'rights',
        name:'rights',
        meta:{title:'权限管理'},
        component: ()=>import('../views/home/child/limits/rights.vue'),
      },
      {
        path:'roles',
        name:'roles',
        meta:{title:'角色列表'},
        component: ()=>import('../views/home/child/limits/roles.vue'),
      },
      {
        path:'categories',
        name:'categories',
        meta:{title:'商品分类'},
        component: ()=>import('../views/home/child/goods/categories.vue'),
      },
      {
        path:'params',
        name:'params',
        meta:{title:'商品参数'},
        component: ()=>import('../views/home/child/goods/params.vue'),
      },
      {
        path:'goods',
        name:'goods',
        meta:{title:'商品列表'},
        component: ()=>import('../views/home/child/goods/goodslist.vue'),
      },
      {
          path:'add',
          name:'add',
          meta:{title:'添加商品'},
          component:()=>import('../views/home/child/goods/addgoods.vue'),
      },
      {
        path:'orders',
        name:'orders',
        meta:{title:'商品列表'},
        component: ()=>import('../views/home/child/order/orders.vue'),
      },
      {
        path:'reports',
        name:'reports',
        meta:{title:'数据报表'},
        component: ()=>import('../views/home/child/reports/reports.vue'),
      },
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
//通过token来检测当前浏览器中用户是否登陆。
router.beforeEach((to,from,next)=>{

  //如果访问的是登录页 可以没有token
    if(to.path==='/login') return next();
    const token = sessionStorage.getItem('token');
    //如果未登陆 则强行跳转到登录页
   if(!token) return next('/login');
   //登陆了则正常跳转
   document.title = to.meta.title;
   if(to.matched[1]){
     sessionStorage.setItem("activeIndex", to.matched[1].name);
    //  console.log(Vue.prototype.$bus);
     Vue.prototype.$bus.$emit('jump');
    }
   next();
})

export default router
