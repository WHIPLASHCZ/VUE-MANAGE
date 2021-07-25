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
    meta:{title:'首页'}
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//通过token来检测当前浏览器中用户是否登陆。
router.beforeEach((to,from,next)=>{
  console.log(to);
  //如果访问的是登录页 可以没有token
    if(to.path==='/login') return next();
    const token = sessionStorage.getItem('token');
    //如果未登陆 则强行跳转到登录页
   if(!token) return next('/login');
   //登陆了则正常跳转
   document.title = to.meta.title;
   next();
})

export default router
