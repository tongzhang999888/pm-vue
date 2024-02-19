import Vue from 'vue'
import router from '@/router'
/*实现界面中按钮等组件的控制
 *使用指令
 *v-permission="{action:''}"
 *v-permission="{action:'', effect:'disabled'}"
 */
Vue.directive('permission', {
  inserted: function(el, binding){
    const action = binding.value.action
    const currentRight = router.currentRoute.meta
    console.log(action)
    if(currentRight) {
      if(currentRight.indexOf(action) == -1) {
        // 不具备权限
        console.log('不具备权限'+action)
        const type = binding.value.effect
        if(type === 'disabled') {
          el.disabled = true
          el.classList.add('is-disabled')
        } else {
          el.parentNode.removeChild(el)
        }
      }
    }
  }
})
//实现界面中按钮等组件的控制,如果无权限则显示
//使用指令
//v-none="{action:''}"
//v-none="{action:'', effect:'disabled'}"
Vue.directive('none', {
  inserted: function(el, binding){
    const action = binding.value.action
    const currentRight = router.currentRoute.meta
    if(currentRight) {
      if(currentRight.indexOf(action) != -1) {
        const type = binding.value.effect
        if(type === 'disabled') {
          el.disabled = true
          el.classList.add('is-disabled')
        } else {
          el.parentNode.removeChild(el)
        }
      }
    }
  }
})
//实现界面中按钮等组件的控制，path存在则显示
//使用指令
//v-path="{action:''}"
//v-path="{action:'', effect:'disabled'}"
Vue.directive('path', {
    inserted: function(el, binding){
      const action = binding.value.action
      //const currentRight = router.currentRoute.meta
      const rightList = JSON.parse(window.localStorage.getItem('permission'))
      var path = []
      rightList.forEach(item => {
        path.push(item.path)
      })
      console.log(path)
      if(path) {
        if(path.indexOf(action) == -1) {
          // 不具备权限
          const type = binding.value.effect
          if(type === 'disabled') {
            el.disabled = true
            el.classList.add('is-disabled')
          } else {
            el.parentNode.removeChild(el)
          }
        } 
      }
    }
  })
