import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import store from './store'
import ElementUI, { Message } from 'element-ui' //element-ui的全部组件
import 'element-ui/lib/theme-chalk/index.css'//element-ui的css
import './utils/permission.js'



Vue.config.productionTip = false
Vue.use(ElementUI) //使用elementUI
Vue.prototype.axios = axios;

//将token添加到axios请求头部
axios.interceptors.request.use(
  config => {
      if (localStorage.getItem('token')) {
          config.headers.token = localStorage.getItem('token')
      }
      return config
  },
  error => {
      return Promise.reject(error)
  }
)
/**
 * 拦截器，拦截非权限内的请求
 */
axios.interceptors.request.use(function(req){
    const currentUrl = req.url.replace("http://localhost:8083/","/")
    const method = req.method.toUpperCase()
    console.log(currentUrl)
    console.log(method)
    if(currentUrl=='/login'||currentUrl=='/register'||currentUrl.startsWith('/login/')){
        return req
    }else{
        var has = false;
        const operations = JSON.parse(localStorage.getItem('operations'))
        console.log(operations)
        operations.forEach(operation => {
            //let matchRegex = operation.url.replace("\\{[^/]*\\}", "[^/]*")
            //console.log(matchRegex)
        if(operation.method==method&&operation.url==currentUrl){
            has = true
        }//else if(operation.method==method&&matchRegex.test(currentUrl)){
           // has = true
        //}
        })
        if(has){
            return req
        }else{
            return req
            alert('没有权限')
            return Promise.reject(new Error('没有权限'))
        }
    }
  })
/**
 * 拦截器，拦截错误响应，显示错误信息
 */
axios.interceptors.response.use((response) => response,
(error) => {
  console.log(error.response)
    if (error && error.response) {
        error.data = {};
        switch (error.response.status) {
            case 400:
                error.data.msg = '错误请求';
                Message.error(error.data.msg)
                break
            case 401:
                error.data.msg = '未授权，请重新登录';
                Message.error(error.data.msg)
                store.commit('logout')
                router.push('/login')
                break
            case 403:
                error.data.msg = '拒绝访问';
                Message.error(error.data.msg)
                break
            case 404:
                error.data.msg = '请求错误,未找到该资源';
                Message.error(error.data.msg)
                break
            case 405:
                error.data.msg = '请求方法未允许';
                Message.error(error.data.msg)
                break
            case 408:
                error.data.msg = '请求超时';
                Message.error(error.data.msg)
                break
            case 500:
                error.data.msg = '服务器端出错';
                Message.error(error.data.msg)
                break
            case 501:
                error.data.msg = '网络未实现';
                Message.error(error.data.msg)
                break
            case 502:
                error.data.msg = '网络错误';
                Message.error(error.data.msg)
                break
            case 503:
                error.data.msg = '服务不可用';
                Message.error(error.data.msg)
                break
            case 504:
                error.data.msg = '网络超时';
                Message.error(error.data.msg)
                break
            case 505:
                error.data.msg = 'http版本不支持该请求';
                Message.error(error.data.msg)
                break
            default:
                error.data.msg = `连接错误${error.response.status}`;
                Message.error(error.data.msg)
        }
    } else {
        error.data.msg = "连接到服务器失败";
        Message.error(error.data.msg)
    }
    return Promise.reject(error);
}
)



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
