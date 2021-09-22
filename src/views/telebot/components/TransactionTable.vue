<template>
  <el-table :data="lists" style="width: 100%;padding-top: 15px;">
    <el-table-column label="订单数量" min-width="100">
      <template slot-scope="scope">
        {{ scope.row.order_no }}
      </template>
    </el-table-column>
    <el-table-column label="总计金额" width="195" align="center">
      <template slot-scope="scope">
        ¥{{ scope.row.price }}
      </template>
    </el-table-column>
    <el-table-column label="订单状态" width="100" align="center">
      <template slot-scope="{row}">
        <el-tag :type="row.status | statusFilter">
          {{ row.status | statusFilters }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
// import { transactionList } from '@/api/remote-search'
const statusMaps = [
  {
    id: 0,
    name: '待完成'
  },
  {
    id: 1,
    name: '已完成'
  },
  {
    id: 2,
    name: '已取消'
  },
  {
    id: 3,
    name: '已拒绝'
  }
]
const statusMap = [
  'info',
  'success',
  'danger',
  'warning'
]
export default {
  filters: {
    statusFilter(st) {
      // console.log(st)
      return statusMap[st]
    },
    statusFilters(status) {
      for (const v of statusMaps) {
        if (v.id === status) {
          return v.name
        }
      }
      return 'unKnow'
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  props: {
    lists: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
    }
  },
  created() {
    // console.log(this.lists[0])
  },
  methods: {
    // fetchData() {
    //   transactionList().then(response => {
    //     this.list = response.data.items.slice(0, 8)
    //   })
    // }
  }
}
</script>
