<template>
  <div class="app-container">
    <div class="filter-container">
      &#12288;&#12288;
      &#12288;&#12288;
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleCreate">
        新增客服
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
      <el-table-column label="ID" prop="id" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客服名" prop="id" align="center" width="220">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客服链接" prop="id" align="center" width="220">
        <template slot-scope="{row}">
          <span>{{ row.link }}</span>
        </template>
      </el-table-column>
      <el-table-column label="展示类型" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.status | typeFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.ctime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
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
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="状态">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item.id" :label="item.name" :value="item.id" :aria-label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="展示类型">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in typeOption" :key="item.id" :label="item.name" :value="item.id" :aria-label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="客服名">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="链接地址">
          <el-input v-model="temp.link" />
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

    <el-dialog :visible.sync="dialogPvVisible" title="删除提示">
      <template>
        <span>
          点击继续提交将会删除掉记录不可恢复，<br>
          确定吗？
        </span>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogPvVisible = false">
          返回
        </el-button>
        <el-button type="primary" @click="handlerDel()">继续提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { getList, update, del, add } from '@/api/telebot/contact'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'

const statusOption = [
  {
    id: 0,
    name: '禁用'
  },
  {
    id: 1,
    name: '启用'
  }
]
const typeOption = [
  {
    id: 1,
    name: '超文本类型'
  },
  {
    id: 2,
    name: '按钮类型'
  }
]
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
    typeFilter(id) {
      for (const v of typeOption) {
        if (id === v.id) {
          return v.name
        }
      }
      return '未知状态'
    }
  },
  data() {
    return {
      typeOption: typeOption,
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
      downloadLoading: false
    }
  },
  created() {
    this.getList()
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
    resetTemp() {
      this.temp = {
        status: 1,
        type: 1
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
      this.dialogFormVisible = false
      add(this.temp).then(() => {
        this.getList()
        this.$notify({
          title: 'Success',
          message: 'Update Successfully',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
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
    handleDelete(row) {
      this.temp = Object.assign({}, row)
      row.t = new Date().getTime()
      this.temp = row
      this.dialogPvVisible = true
    },
    handlerDel() {
      del(this.temp).then(res => {
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        this.dialogPvVisible = false
        this.getList()
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
