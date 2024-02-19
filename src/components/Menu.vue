<template>
    	<body>
		<div id="app">
			<el-menu style="height:100%;" background-color="#545c64" text-color="#ffffff"
				active-text-color="#ffd04b">
				<el-submenu :index="menu.id" v-for="menu of menuList" :key="menu.id">
					<template slot="title">
                        <router-link :to="menu.route"><span>{{menu.name}}</span></router-link>
					</template>
					<el-submenu :index="child.id" :key="child.id" v-for="child of menu.children"
						v-if="child.children != null">
						<template slot="title">
							<router-link :to="child.route"><span>{{child.name}}</span></router-link>
						</template>
						<el-menu-item :index="ch.id" :key="ch.id" v-for="ch of child.children">
                            <router-link :to="child.route"><span>{{child.name}}</span></router-link>
						</el-menu-item>
					</el-submenu>
					<el-menu-item v-for="child of menu.children" v-if="child.children == null" :index="child.id"
						:key="child.id">
						<router-link :to="child.route"><span>{{child.name}}</span></router-link>
					</el-menu-item>
				</el-submenu>
			</el-menu>
		</div>
	</body>
  </template>

  
  <script>
  export default {
    //输出组件
    name: "Aside",
      props: {
          menuList: {
              type: Array,
              default: () => {
                  return [{id:"1",name:"请登录",children:[{id:"2",name:"请登录",children:[],route:"/login"}],route:"/login"}]
              }
          }
      },
      methods: {
          
      }
  }
  </script>
  
  <style scoped>
a {
    text-decoration: none;
    color: #fff;
}
 
.router-link-active {
    text-decoration: none;
 
}
  </style>
  