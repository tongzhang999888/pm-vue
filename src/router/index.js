import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import Login from "@/components/Login.vue"
import Register from "@/components/Register.vue"
import ForgetPassword from "@/components/ForgetPassword.vue"
import Permissions from "@/components/Permissions.vue"
import Roles from "@/components/Roles.vue"
import Users from "@/components/Users.vue"
import UserInfo from "@/components/UserInfo.vue"
import PMcenter from "@/components/PMcenter.vue"
import Settings from "@/components/Settings.vue"
import MainMenu from "@/components/MainMenu.vue"
import UserCenter from "@/components/UserCenter.vue"
import UserCenterItems from "@/components/UserCenterItems.vue"
import UserCenterNewItems from "@/components/UserCenterNewItems.vue"
import UserCenterSetEmail from "@/components/UserCenterSetEmail.vue"
import UserCenterSetPassword from "@/components/UserCenterSetPassword.vue"
//import NewPermission from "@/components/NewPermission.vue"
//import NewRole from "@/components/NewRole.vue"
//import NewUser from "@/components/NewUser.vue"

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, resolve, reject) {
    if ( resolve || reject ) return originalPush.call(this, location, resolve, reject)
    return originalPush.call(this, location).catch((e)=>{})
}


const userRule = {
  path:"/permission-management-center/users",
  name:'users',
  component:Users
}
const roleRule = {
  path:"/permission-management-center/roles",
  name:'roles',
  component:Roles
}
const permissionRule = {
  path:"/permission-management-center/permissions",
  name:'permissions',
  component:Permissions
}
const userCenterRule = {
  path:"/user-center",
  name:'user-center',
  component:UserCenter
}
const mainMenuRule = {
  path:"/main",
  name:'main',
  component:MainMenu
}
const userCenterItemsRule = {
  path:"/user-center/items",
  name:'user-items',
  component:UserCenterItems
}
const userCenterNewItemsRule = {
  path:"/user-center/new-item",
  name:'new-item',
  component:UserCenterNewItems
}
const userCenterSetEmailRule = {
  path:"/user-center/set-email",
  name:'set-email',
  component:UserCenterSetEmail
}
const userCenterSetPasswordRule = {
  path:"/user-center/set-password",
  name:'set-password',
  component:UserCenterSetPassword
}
const userInfoRule = {
  path:'/user',
  name:'user-info' ,
  component:UserInfo,
}

const ruleMapping = {
  'users': userRule,
  'roles': roleRule,
  'permissions': permissionRule,
  'main': mainMenuRule,
  'user-center': userCenterRule,
  'set-password': userCenterSetPasswordRule,
  'set-email': userCenterSetEmailRule,
  'user-items': userCenterItemsRule,
  'new-item': userCenterNewItemsRule,
  'user-info': userInfoRule,

}

const routes = [
  {
    path:'/',
    redirect:'login' 
  },

  {
    path:'/login',
    name:'login' ,
    component:Login
  },

  {
    path:'/register',
    name:'register' ,
    component:Register
  },

  {
      path:"/login/forget-password",
      name:'forget-password',
      component:ForgetPassword
  },

  {
    path:'/permission-management-center',
    name:'permission-management-center' ,
    component:PMcenter,
  },


  {
    path:"/permission-management-center/settings",
    name:'settings',
    component:Settings
  },

  // {
  //   path:"/permission-management-center/roles",
  //   name:'roles',
  //   component:Roles
  // },

  // {
  //   path:"/permission-management-center/users",
  //   name:'users',
  //   component:Users
  // },
  // {
  //   path:'/permission-management-center/permissions/new-permission',
  //   name:'new-permission' ,
  //   component:NewPermission
  // },
  // {
  //   path:'/permission-management-center/roles/new-role',
  //   name:'new-role' ,
  //   component:NewRole
  // },
  // {
  //   path:'/permission-management-center/users/new-user',
  //   name:'new-user' ,
  //   component:NewUser
  // },

]

const router = new VueRouter({
  routes
})


    /**
     * 添加动态路由
     */
export function initDynamicRoutes() {
  const rightList = JSON.parse(window.localStorage.getItem('permission'))
        console.log(rightList)
        rightList.forEach(item => {
          const itemRule = ruleMapping[item.path]
          itemRule.meta = item.rights
          console.log(itemRule)
          router.addRoute(itemRule)
        })
}
    /**
     * 路由导航守卫
     */
var flag = false
router.beforeEach((to, from, next) => {
  if (to.path === '/login' || to.path === '/register'|| to.path === '/login/forget-password') {
      next()
  } else {
      const token = window.localStorage.getItem('token')
      if (!token) {
          return next('/login')
      }
      if(!flag){
        initDynamicRoutes()
        flag=true
        next(to.path)
      }else{next()}
      //initDynamicRoutes()
      //next({...to,replace:true})
      //next(to.path)
      //return next()
  }
})

export default router
