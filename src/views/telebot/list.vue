<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.id" placeholder="订单ID" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      &#12288;&#12288;
      <el-select v-model="listQuery.status" placeholder="状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in statusOptions" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      &#12288;&#12288;
      <el-date-picker v-model="listQuery.date" type="date" class="filter-item" placeholder="选择日期" />
      &#12288;&#12288;
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="订单ID" prop="id" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.oid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="派发卡ID" prop="id" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.bid | bankFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户身份ID" prop="id" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.sid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单金额" prop="id" align="center" width="120">
        <template slot-scope="{row}">
          <span>￥{{ row.amount | amountFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.ctime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户提交的信息" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="互动消息" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.text }}</span>
        </template>
      </el-table-column>
      <el-table-column label="转账截图" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-image v-if="row.img !== null" style="width: 50px; height: 50px" :src="row.img" :fit="cover" @click="handlerOpen(row.img)" />
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.status | statusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作区" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button v-if="handlerFilter(row.ctime, row.status)" type="primary" size="mini" @click="handleUpdate(row)">
            处理申请
          </el-button>
          <el-button v-if="timeFilter(row.ctime)" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除申请
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="更改状态">
          <el-select v-model="temp.status" class="filter-item" placeholder="请选择">
            <el-option v-for="item in statusOpt" :key="item.id" :label="item.name" :value="item.id" :aria-label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="temp.status ===3" label="理由">
          <el-input v-model="temp.remark" />
        </el-form-item>
        <el-form-item v-if="temp.status ===1" label="派银行卡">
          <el-select v-model="temp.bid" class="filter-item" filterable placeholder="请选择" @blur="searchBlur">
            <el-option v-for="item in bankOption" :key="item.id" :label="item.bid" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="temp.status ===1 && temp.bid ===0" label="卡主姓名">
          <el-input v-model="temp.BankUser" />
        </el-form-item>
        <el-form-item v-if="temp.status ===1 && temp.bid ===0" label="银行名称">
          <el-input v-model="temp.BankName" />
        </el-form-item>
        <el-form-item v-if="temp.status ===1 && temp.bid ===0" label="银行卡号">
          <el-input v-model="temp.BankNumber" />
        </el-form-item>
        <el-form-item v-if="temp.status ===1 && temp.bid ===0" label="开户行">
          <el-input v-model="temp.BankOpen" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          返回
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          提交
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="截图缩放">
      <template :slot-scope="image">
        <el-image style="width: 450px; height: 800px" :src="image" :fit="cover" />
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { getBank, getList, update, del } from '@/api/telebot/list'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'

const statusOption = [
  {
    id: 0,
    name: '未处理'
  },
  {
    id: 1,
    name: '待付款'
  },
  {
    id: 2,
    name: '已完成'
  },
  {
    id: 3,
    name: '已拒绝/失败'
  },
  {
    id: 4,
    name: '用户取消'
  },
  {
    id: 5,
    name: '通知已付款'
  }
]
let bankOption = []
export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(id) {
      for (const v of statusOption) {
        if (id === v.id) {
          return v.name
        }
      }
      return '未知状态'
    },
    bankFilter(id) {
      for (const v of bankOption) {
        if (id === v.id) {
          return v.bid
        }
      }
      return '未知状态'
    },
    amountFilter(amount) {
      return (parseInt(amount) / 100).toFixed(2)
    }
  },
  data() {
    return {
      image: '',
      statusOpt: [],
      bankOption: bankOption,
      statusOptions: statusOption,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      importanceOptions: [1, 2, 3],
      showReviewer: false,
      temp: {
        t: new Date().getTime()
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      downloadLoading: false
    }
  },
  created() {
    this.getBank()
  },
  methods: {
    timeFilter(time) {
      const today = new Date()
      today.setHours(0)
      today.setMinutes(0)
      today.setSeconds(0)
      return (new Date(parseInt(time) * 1000).getTime()) <= today.getTime()
    },
    handlerFilter(time, status) {
      const today = new Date()
      today.setHours(0)
      today.setMinutes(0)
      today.setSeconds(0)
      const b = (new Date(parseInt(time) * 1000).getTime()) > today.getTime()
      if (status === 2 || status === 3 || status === 4) {
        return false
      }
      return b
    },
    getBank() {
      getBank(new Date().getTime()).then(res => {
        this.getList()
        bankOption = [{ id: 0, bid: '自定义/未派发' }]
        for (const v of res.data.item) {
          bankOption.push(v)
        }
        this.bankOption = bankOption
      })
    },
    handlerOpen(img) {
      this.image = img
      this.dialogPvVisible = true
    },
    searchBlur(e) {
      this.form.ltOldno = e.target.value
    },
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.t = new Date().getTime()
      this.statusOpt = []
      if (this.temp.status === 1) {
        this.statusOpt.push({ id: 1, name: '更换银行卡' })
        this.statusOpt.push({ id: 3, name: '拒绝申请' })
      } else if (this.temp.status === 0) {
        this.statusOpt.push({ id: 1, name: '派发银行卡' })
        this.statusOpt.push({ id: 3, name: '拒绝申请' })
        this.temp.status = 1
      } else if (this.temp.status === 5) {
        this.temp.status = 2
        this.statusOpt.push({ id: 2, name: '已完成' })
        this.statusOpt.push({ id: 3, name: '已失败' })
      } else {
        this.temp.status = ''
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          update(this.temp).then(() => {
            this.dialogFormVisible = false
            if (this.temp.status === 1) {
              this.getBank()
            }
            this.getList()
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      row.t = new Date().getTime()
      del(row).then(res => {
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
