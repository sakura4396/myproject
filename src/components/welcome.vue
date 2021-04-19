<template>
  <div>
    <div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-card>
      <el-row>
        <img src="../assets/logo.jpeg" alt />
        <span class="desc">欢迎来到我的主页，这些都是个人随笔，希望你也喜欢</span>
        <span class="time">12:00:00</span>
      </el-row>
    </el-card>
    <div id="main"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import axios from 'axios'
export default {
  data () {
    return {
    }
  },
  mounted () {
    this.loadWeatherInfo()
  },
  methods: {
    async loadWeatherInfo () {
      const chartDom = document.getElementById('main')
      const myChart = echarts.init(chartDom)
      // 获取数据
      const { data: res } = await axios.get('https://tianqiapi.com/api?version=v1&appid=66215437&appsecret=eVliSt9p')
      if (!res.data) {
        this.$message.error('天气数据获取失败')
        return false
      }
      const dayArr = [] // 日期
      const maxArr = [] // 最高温
      const minArr = [] // 最低温
      const weaArr = [] // 气象

      for (let i = 0; i < res.data.length; i++) {
        const nowRow = res.data[i]
        dayArr.push(nowRow.day)
        maxArr.push(nowRow.tem1.substr(0, nowRow.tem1.length - 1))
        minArr.push(nowRow.tem2.substr(0, nowRow.tem2.length - 1))
        weaArr.push(nowRow.wea)
      }
      console.log(weaArr)
      const option = {
        title: {
          text: '武汉近7日的天气情况',
          left: 600
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['最高温度', '最低温度'],
          left: 100
        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            dataView: { readOnly: false },
            magicType: { type: ['line', 'bar'] },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: dayArr
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} °C'
          }
        },
        series: [{
          name: '最高温度',
          data: maxArr,
          type: 'line',
          markLine: {
            data: [
              { type: 'average', name: '平均值' }
            ]
          }
        },
        {
          name: '最低温度',
          data: minArr,
          type: 'line',
          markLine: {
            data: [
              { type: 'average', name: '平均值' }
            ]
          }
        }]
      }
      if (option && typeof option === 'object') {
        myChart.setOption(option)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  img {
    width: 70px;
    height: 70px;
    border-radius: 100%;
  }
  .desc {
    position: absolute;
    font-size: 22px;
    margin-left: 10px;
    transform: translateY(70%);
  }
  .time {
    position: absolute;
    right: 10px;
    margin: auto 0;
    width: 300px;
    height: 100%;
    background-color: black;
    font-size: 74px;
    line-height: 100%;
    color: #fff;
  }
}
#main {
  height: 450px;
  width: 100%;
  margin-top: 20px;
}
</style>
