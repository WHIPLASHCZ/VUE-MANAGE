import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'

Vue.config.productionTip = false;
Vue.prototype.$bus= new Vue;
import {
  Button,Form,FormItem,Input,Icon,Message,Alert,
  Container,Header,Aside,Main,Menu,Submenu,MenuItem,MenuItemGroup,Breadcrumb,BreadcrumbItem,Card,Row,Col,
  Table,TableColumn,Switch,Tooltip,Pagination,Dialog,Tag,MessageBox,Tree,Select,Option
} from 'element-ui';
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Icon);
// Vue.use(Message);
Vue.use(Alert);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup)
Vue.use(Submenu);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Card);
Vue.use(Row);
Vue.use(Col);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Switch);
Vue.use(Tooltip);
Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Tag);
Vue.use(Tree);
Vue.use(Select);
Vue.use(Option);
Vue.prototype.$alert = Alert;
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
