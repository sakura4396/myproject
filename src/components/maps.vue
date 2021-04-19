<template>
  <div class="main">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>功能展示</el-breadcrumb-item>
      <el-breadcrumb-item>路径规划</el-breadcrumb-item>
    </el-breadcrumb>
    <div id="map" @contextmenu.prevent="clearPos"></div>
    <div class="info">
      <el-form
        :model="routeForm"
        :rules="routeFormRules"
        ref="routeFormRef"
        label-width="60px"
        class="infoForm"
      >
        <el-form-item label="起点" prop="start">
          <el-input
            v-model="routeForm.start"
            clearable
            id="tipInput"
            @keyup.enter.native="searchPlace"
            @blur="clearSearch"
          ></el-input>
        </el-form-item>
        <el-form-item label="终点" prop="end">
          <el-input
            v-model="routeForm.end"
            clearable
            id="tipOutput"
            @keyup.enter.native="searchPlace"
          ></el-input>
        </el-form-item>
        <div class="btn">
          <el-button type="info" size="small" @click="toggleTraffic()">切换路况显示</el-button>
          <el-button type="primary" size="small" @click="planRoute">路径规划</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { loadAMap } from '@/utils/loadmap'
let AMap = window.AMap
export default {
  data () {
    return {
      map: {}, // 地图实例对象
      routeForm: { // 路径规划
        start: '',
        end: ''
      },
      routeFormRules: {
        start: [{ required: true, message: '请输入起点', trigger: 'blur' }],
        end: [{ required: true, message: '请输入终点', trigger: 'blur' }]
      },
      defaultCity: '武汉', // 默认城市
      trafficLayer: {}, // 交通情况
      istrafficVisible: false, // 控制交通情况是否显示
      autoOptions: {}, // 输入提示
      placeSearch: null, // 搜索对象
      searchValue: '', // 搜索关键字
      startIcon: {}, // 起始标志
      endIcon: {}, // 终点标志
      startPos: [], // 起点坐标
      endPos: [], // 终点坐标
      route: null, // 路线
      markerArr: []
    }
  },
  methods: {
    // 地图初始化
    initMap () {
      this.map = new AMap.Map('map', {
        resizeEnable: true, // 是否监控地图容器尺寸变化
        zoom: 13, // 初始化地图层级
        center: [114.36, 30.53] // 初始化地图中心点
      })
      this.trafficLayer = new AMap.TileLayer.Traffic({
        zIndex: 10
      })
      this.trafficLayer.setMap(this.map)
      this.trafficLayer.hide()
      this.addAMapAutocompletePlaceSearch()
      // 初始化图标
      this.startIcon = new AMap.Icon({
        size: new AMap.Size(25, 34), // 图标尺寸
        image: '//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png', // 图标的取图地址
        imageSize: new AMap.Size(135, 40), // 图标所用图片大小
        imageOffset: new AMap.Pixel(-9, -3) // 图标取图偏移量
      })
      this.endIcon = new AMap.Icon({
        size: new AMap.Size(25, 34),
        image: '//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png',
        imageSize: new AMap.Size(135, 40),
        imageOffset: new AMap.Pixel(-95, -3)
      })
      this.map.on('click', e => {
        const POS = [e.lnglat.getLng(), e.lnglat.getLat()]
        if (this.startPos.length !== 0) {
          if (this.endPos.length !== 0) {
            if (!this.route) {
              this.$message.error('终点已绘制完成，请进行路线规划')
            }
            return false
          }
          this.endPos = POS
          this.addMaker(POS, false)
          if (this.routeForm.end === '') {
            this.routeForm.end = this.endPos.join('')
          }
        } else {
          this.startPos = POS
          this.addMaker(POS, true)
          if (this.routeForm.start === '') {
            this.routeForm.start = this.startPos.join('')
          }
        }
      })
    },
    // 切换路况
    toggleTraffic () {
      if (this.isVisible) {
        this.trafficLayer.hide()
        this.isVisible = false
      } else {
        this.trafficLayer.show()
        this.isVisible = true
      }
    },
    // 搜索提示
    addAMapAutocompletePlaceSearch () {
      // 自动提示
      this.map.plugin(['AMap.PlaceSearch', 'AMap.AutoComplete'], () => {
        const autoInput = new AMap.Autocomplete({
          input: 'tipInput',
          city: this.defaultCity,
          citylimit: true
        })
        const autoOutput = new AMap.Autocomplete({
          input: 'tipOutput'
        })
        // 搜索
        this.placeSearch = new AMap.PlaceSearch({
          type: '',
          city: this.defaultCity, // 寻找的城市
          citylimit: true, // 是否只在该城市寻找
          map: this.map // 结果展示处
        })
        autoInput.on('select', this.autocomplete)
        autoOutput.on('select', this.autocomplete)
      })
    },
    // 自动提示
    autocomplete (e) {
      this.searchValue = e.poi.name
    },
    // 点击enter搜索地点
    searchPlace () {
      this.placeSearch.search(this.searchValue)
    },
    // 失去焦点清除所有搜索结果
    clearSearch () {
      if (this.startPos.length !== 0 && this.endPos.length !== 0) {
        this.placeSearch.clear()
      }
    },
    // 右键删除
    clearPos () {
      if (this.markerArr.length === 2) { // 两个图标都有
        this.endPos = []
        this.routeForm.end = ''
        this.map.remove(this.markerArr[1])
        this.route.destroy()
        this.markerArr.pop()
      } else if (this.markerArr.length === 1) {
        this.startPos = []
        this.routeForm.start = ''
        this.map.remove(this.markerArr[0])
        this.markerArr.pop()
      } else {
        this.$message.info('地图上没有标记点')
      }
    },
    // 绘制路径
    planRoute () {
      const path = []
      path.push(this.startPos)
      path.push(this.endPos)
      this.map.plugin('AMap.DragRoute', () => {
        this.route = new AMap.DragRoute(this.map, path, AMap.DrivingPolicy[4])
        this.route.search()
      })
    },
    // 添加图标
    addMaker (pos, bool) {
      const marker = new AMap.Marker({
        icon: bool === true ? this.startIcon : this.endIcon,
        position: pos,
        offset: new AMap.Pixel(-13, -30)
      })
      marker.setMap(this.map)
      this.markerArr.push(marker)
    }
  },
  mounted () {
    // 判断地图加载情况
    loadAMap().then((aMap) => {
      AMap = aMap
      console.log('地图加载成功')
      setTimeout(() => {
        this.initMap()
      }, 500)
    }).catch(err => {
      this.$message.error('地图加载失败')
      console.log(err)
    })
  }
}
</script>

<style lang="less" scoped>
.main {
  height: 100%;
}
#map {
  height: calc(100% - 53.6px);
}
.info {
  height: 200px;
  width: 300px;
  position: absolute;
  right: 20px;
  bottom: 20px;
  background: #fff;
}
.infoForm {
  position: absolute;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  bottom: 10px;
}
.btn {
  padding-left: 10px;
  padding-right: 10px;
  display: flex;
  justify-content: space-between;
}
</style>
