import Vue from 'vue'
import {
  Form,
  FormItem,
  Input,
  Button,
  Col,
  Message,
  Container,
  Header,
  Aside,
  Menu,
  MenuItem,
  Main,
  Submenu,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  MessageBox,
  Dialog,
  Table,
  TableColumn,
  Pagination,
  Tooltip,
  Select,
  Option
} from 'element-ui'

Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Col)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Main)
Vue.use(Submenu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Dialog)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Tooltip)
Vue.use(Option)
Vue.use(Select)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
