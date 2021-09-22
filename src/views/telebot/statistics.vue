<template>
  <div class="dashboard-editor-container">
    <panel-group :panel="panel" @handleSetLineChartData="handleSetLineChartData" />
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>
    <div class="filter-container">
      <el-input v-model="listQuery.id" placeholder="订单ID/UID" style="width: 200px;" class="filter-item" />
      &#12288;&#12288;
      &#12288;&#12288;
      <el-date-picker v-model="listQuery.startDate" type="date" class="filter-item" placeholder="选择开始日期" />
      &#12288;&#12288;
      <el-date-picker v-model="listQuery.endDate" type="date" class="filter-item" placeholder="选择结束日期" />
      &#12288;&#12288;
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList()">
        搜索
      </el-button>
    </div>
    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table v-loading="listLoading" :lists="transactionList" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
// import RaddarChart from './components/RaddarChart'
// import PieChart from './components/PieChart'
// import BarChart from './components/BarChart'
import TransactionTable from './components/TransactionTable'
import { getList, getStatic } from '@/api/statistics'
// import TodoList from './components/TodoList'
// import BoxCard from './components/BoxCard'

let lineChartData = {
  newVisitis: {
    expectedData: [1, 120, 161, 134, 105, 160, 165]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'ComplexTable',
  components: {
    PanelGroup,
    LineChart,
    TransactionTable
  },
  data() {
    return {
      listLoading: true,
      panel: {
        newVisitis: 0,
        message: 0,
        purchases: 0,
        shopping: 0
      },
      transactionList: [],
      listQuery: {
        t: new Date().getTime()
      },
      lineChartData: lineChartData.newVisitis
    }
  },
  created() {
    getStatic(new Date().getTime()).then(res => {
      lineChartData = res.data.lineChartData
      this.panel = res.data.panel
      this.lineChartData = lineChartData.newVisitis
      this.getList()
    })
  },
  methods: {
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(res => {
        this.transactionList = res.data.items
        this.transactionList = res.data.items
        setTimeout(() => {
          this.listLoading = false
        }, 1000)
      })
    },
    handleSetLineChartData(type) {
      console.log(type)
      this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
