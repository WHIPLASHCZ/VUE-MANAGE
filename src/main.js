import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'

import TreeTable from 'vue-table-with-tree-grid';

Vue.config.productionTip = false;
Vue.prototype.$bus= new Vue;
import {
  Button,Form,FormItem,Input,Icon,Message,Alert,
  Container,Header,Aside,Main,Menu,Submenu,MenuItem,MenuItemGroup,Breadcrumb,BreadcrumbItem,Card,Row,Col,
  Table,TableColumn,Switch,Tooltip,Pagination,Dialog,Tag,MessageBox,Tree,Select,Option,Cascader,Tabs,TabPane
  ,Step,Steps,CheckboxGroup,Checkbox
  ,Upload,Timeline,TimelineItem
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
Vue.use(Cascader);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Step);
Vue.use(Steps);
Vue.use(CheckboxGroup);
Vue.use(Checkbox);
Vue.use(Upload);
Vue.use(Timeline);
Vue.use(TimelineItem);
// 文本工具
import VueQuillEditor from 'vue-quill-editor';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
Vue.use(VueQuillEditor);

// tree-table组件
Vue.component('tree-table',TreeTable);
Vue.filter('dateFormat',(oldval,newval)=>{
  const dt = new Date(oldval);
  let y = dt.getFullYear();
  let m = (dt.getMonth()+1+'').padStart(2,'0');
  let d = (dt.getDate()+'').padStart(2,'0');
  let hh = (dt.getHours()+'').padStart(2,'0');
  let mm = (dt.getMinutes()+'').padStart(2,'0');
  let ss = (dt.getSeconds()+'').padStart(2,'0');
  // console.log(`${y}-${m}-${d} ${hh}:${mm}:${ss}`);
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
})
Vue.prototype.$alert = Alert;
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox;



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
