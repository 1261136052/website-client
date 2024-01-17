<template>
  <el-tabs v-model="activeName" type="card" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane label="已购买" name="first">
      <el-table :data="goData.buyOrder" style="width: 100%">
        <el-table-column prop="goods.title" label="商品名称" width="120" />
        <el-table-column prop="buyDate" label="购买时间" width="180" />
        <el-table-column prop="goods.userName" label="卖家" width="100" />
        <el-table-column prop="goods.price" label="售价￥" width="100" />
        <el-table-column prop="goods.transactionDate" label="交易时间" />
        <el-table-column prop="goods.transactionAddress" label="交易地点" />
        <el-table-column prop="goods.status" label="状态" />


        <el-table-column fixed="right" label="操作" width="60">
          <template #default="scope">
            <el-button link type="primary" size="small"
             @click="detail(scope.$index, scope.row),dialogFormVisible=true">Detail</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="已卖出" name="second">
      <el-table :data="goData.sellOrder" style="width: 100%">
        <el-table-column prop="goods.title" label="商品名称" width="120" />
        <el-table-column prop="buyDate" label="购买时间" width="180" />
        <el-table-column prop="buyerPhone" label="买家预留电话" width="100" />
        <el-table-column prop="goods.price" label="售价￥" width="100" />
        <el-table-column prop="goods.transactionDate" label="交易时间" />
        <el-table-column prop="goods.transactionAddress" label="交易地点" />


        <el-table-column fixed="right" label="操作" width="60">
          <template #default="scope">
            <el-button link type="primary" size="small"
             @click="detail(scope.$index, scope.row),dialogFormVisible=true">Detail</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>

    <el-tab-pane label="待确认" name="third">
      <el-table :data="goData.waitOrder" style="width: 100%">
        <el-table-column prop="goods.title" label="商品名称" width="120" />
        <el-table-column prop="buyDate" label="购买时间" width="180" />
        <el-table-column prop="buyerPhone" label="买家预留电话" width="100" />
        <el-table-column prop="goods.price" label="售价￥" width="100" />
        <el-table-column prop="goods.transactionDate" label="交易时间" />
        <el-table-column prop="goods.transactionAddress" label="交易地点" />


        <el-table-column fixed="right" label="操作" width="100">
          <template #default="scope">
            <el-button link type="primary" size="small"
             @click="confirm(scope.$index, scope.row)">确认交易</el-button>
             <el-button link type="primary" size="small"
             @click="noConfirm(scope.$index, scope.row)">拒绝交易</el-button>
            <el-button link type="primary" size="small"
             @click="detail(scope.$index, scope.row),dialogFormVisible=true">Detail</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>

    <el-dialog v-model="dialogFormVisible" title="商品详细页" style="height: 650px;" width="600px">

      <div style="height: 480px;width: 560px;">
        <el-descriptions title="Goods Info">
          <el-descriptions-item label="售卖者：">{{ goData.goods.userName }}</el-descriptions-item>
          <el-descriptions-item label="价钱：￥">{{ goData.goods.price }}</el-descriptions-item>
          <el-descriptions-item label="商品类型：">
            <el-tag size="small">{{ com }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="交易地点：">{{ goData.goods.transactionAddress }}</el-descriptions-item>
          <el-descriptions-item label="交易时间：">{{ goData.goods.transactionDate }}</el-descriptions-item>
        </el-descriptions>
        <div style="width: 560px;height: 250px;">
          <div style="width: 560px;height: 250px;">
            <p>商品描述：{{ goData.goods.content }}</p>
          </div>
        </div>
        <div style="width: 560px;height: 100px;display: flex;flex-wrap: wrap;">
          <div class="demo-image__preview" style="width: 100px; height: 100px; margin: 5px;"
            v-for="(g, index) in goData.goods.files" :key="index">
            <el-image style="width: 100px; height: 100px" :src="'http://127.0.0.1:8001' + g.path" :zoom-rate="1.2"
              :preview-src-list="goData.srcList" :initial-index="4" fit="cover" />
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">退出</el-button>
        </span>
      </template>
    </el-dialog>
  </el-tabs>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { defineStore, storeToRefs } from "pinia";
import { reactive, ref, computed, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { testStore } from "../../stores/TestStore"
import { category, Goods, order } from "../../util/clazz"
import type { TabsPaneContext } from 'element-plus'
import axios from 'axios'
const store = testStore()
const dialogFormVisible = ref(false)
const UserData = store.testU
const UserDataRect = reactive(UserData)
const router = useRouter()
const route = useRoute()
let data: order[] = []
let categorys: category[] = []
let strs: string[] = []
let good: Goods = new Goods
let goData = reactive({
  buyOrder: data,
  sellOrder: data,
  waitOrder: data,
  goods: good,
  srcList: strs
})

const com = computed(() => {
  for (let i = 0; i < categorys.length; i++) {
    if (categorys[i].id == goData.goods.categoryId) {
      return categorys[i].categoryName
    }
  }
})

const fun1 = () => {
  axios.get('/order/listBuyGoods', {
  }).then(response => {
    if (response.data.code == 200) {
      goData.buyOrder = response.data.data as order[]
      console.log(response.data.data)
      console.log("succes")
    }
  })
  axios.get('/order/listSellGoods', {
  }).then(response => {
    if (response.data.code == 200) {
      goData.sellOrder = response.data.data as order[]
      console.log(response.data.data)
      console.log("succes")
    }
  })

  axios.get('/order/listWaitGoods', {
  }).then(response => {
    if (response.data.code == 200) {
      goData.waitOrder = response.data.data as order[]
      console.log(response.data.data)
      console.log("succes")
    }
  })

  axios.get('/goods/listGoodsCategory', {
  }).then(response => {
    if (response.data.code == 200) {
      categorys = response.data.data as category[]
      console.log(categorys)
    }
  })

}

fun1()

const detail = (index, row) => {
  axios.get('/goods/queryGoodsById/' + row.goods.id, {
    }).then(response => {
        if (response.data.code == 200) {
          goData.goods = response.data.data as Goods
          goData.srcList = []
            for (let i = 0; i < goData.goods.files.length; i++) {
                let s = 'http://127.0.0.1:8001' + goData.goods.files[i].path
                goData.srcList.push(s)
            }
        }
    })
  
}


const activeName = ref('first')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

const noConfirm= (index, row) => {
    ElMessageBox.confirm(
        '是否拒绝！',
        'Warning',
        {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
        }
    )
        .then(() => {
            ElMessage({
                type: 'success',
                message: 'Delete completed',
            })

            axios.get('/order/confirm/' + row.id+'/'+1, {
                params: {
                }
            }).then(response => {
                if (response.data.code == 200) {
                    fun1()
                    ElMessage({
                        type: 'success',
                        message: '成功',
                    })
                } else {
                    ElMessage({
                        type: 'info',
                        message: 'Delete canceled',
                    })
                }
            })
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: 'Delete canceled',
            })
        })
}


const confirm= (index, row) => {
    ElMessageBox.confirm(
        '是否确认！',
        'Warning',
        {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
        }
    )
        .then(() => {
            ElMessage({
                type: 'success',
                message: 'Delete completed',
            })

            axios.get('/order/confirm/' + row.id+'/'+0, {
                params: {
                }
            }).then(response => {
                if (response.data.code == 200) {
                    fun1()
                    ElMessage({
                        type: 'success',
                        message: '成功',
                    })
                } else {
                    ElMessage({
                        type: 'info',
                        message: 'Delete canceled',
                    })
                }
            })
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: 'Delete canceled',
            })
        })
}
</script>


<style scoped>
.demo-tabs>.el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>


