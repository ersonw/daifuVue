<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.id" placeholder="银行卡/用户ID" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      &#12288;&#12288;
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增录入
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出表格
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
      @sort-change="sortChange"
    >
      <el-table-column label="银行卡ID" prop="id" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.bid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="录入时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.ctime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="卡主姓名" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.BankUser }}</span>
        </template>
      </el-table-column>
      <el-table-column label="银行名称" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.BankName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="银行卡号" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.BankNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开户行" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.BankOpen }}</span>
        </template>
      </el-table-column>
      <el-table-column label="录入用户" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag @click="handleUser(row.uid)">
            {{ row.uid | userFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="管理操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="卡主姓名">
          <el-input v-model="temp.BankUser" />
        </el-form-item>
        <el-form-item label="银行名称">
          <el-input v-model="temp.BankName" />
        </el-form-item>
        <el-form-item label="银行卡号">
          <el-input v-model="temp.BankNumber" />
        </el-form-item>
        <el-form-item label="开户行">
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

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getList, update, del, add, getSid } from '@/api/telebot/card'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
let userMap = []
export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    userFilter(uid) {
      for (const v of userMap) {
        if (v.uid === uid) {
          return v.sid
        }
      }
    }
  },
  data() {
    return {
      userMap: userMap,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      temp: {
        t: new Date().getTime()
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新增'
      },
      dialogPvVisible: false,
      downloadLoading: false
    }
  },
  created() {
    getSid(new Date().getTime()).then(res => {
      userMap = [{ uid: 0, sid: '后台录入' }]
      for (const v of res.data.item) {
        userMap.push(v)
      }
      this.userMap = userMap
      this.getList()
    })
  },
  methods: {
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
    userFilter(uid) {
      for (const v of userMap) {
        if (v.uid === uid) {
          return v.sid
        }
      }
    },
    handleUser(uid) {
      if (uid > 0) {
        this.listQuery.id = this.userFilter(uid)
      }
      this.getList()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
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
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          add(this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.t = new Date().getTime()
          update(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
            this.getList()
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
        const tHeader = ['银行卡ID', '卡主姓名', '银行名称', '银行卡号', '开户行', '录入时间', '录入用户']
        const filterVal = ['bid', 'BankUser', 'BankName', 'BankNumber', 'BankOpen', 'ctime', 'uid']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '银行卡' + new Date().getTime()
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'ctime') {
          return parseTime(v[j])
        } else if (j === 'uid') {
          return this.userFilter(v[j])
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
