<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.jpeg" alt="图标" />
        <span>随笔</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!--页面主体区域-->
    <el-container>
      <!--侧边栏-->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!--侧边栏菜单区域 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{item.cateName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.cateName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--右侧内容主体-->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data () {
    return {
      isCollapse: false,
      activePath: '', // 被激活的链接地址
      menulist: [{
        id: 1,
        cateName: '用户管理',
        path: 'users',
        icon: 'iconfont el-icon-user',
        children: [{
          id: 11,
          cateName: '用户列表',
          path: 'users'
        }
        ]
      },
      {
        id: 2,
        cateName: '功能展示',
        path: 'abilty',
        icon: 'iconfont el-icon-s-tools',
        children: [{
          id: 21,
          cateName: '地图展示',
          path: 'maps'
        }
        ]
      },
      {
        id: 3,
        cateName: '部分页面',
        path: 'pages',
        icon: 'iconfont el-icon-info',
        children: [{
          id: 21,
          cateName: '404',
          path: 'notfound'
        }]
      }]
    }
  },
  created () {

  },
  methods: {
    // 退出功能，删除token
    logout () {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>
<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;

  > div {
    display: flex;
    align-items: center;
  }

  img {
    width: 50px;
    height: 50px;
    border-radius: 100%;
    margin: 0 15px;
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
  padding: 0;
}
.iconfont {
  margin-right: 15px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
