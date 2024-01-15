<template>
    <div style="background-color: white;width: 1000px;height: 660px;flex-wrap: wrap;display: flex;">
        <div style="width: 1000px;height: 50px;background-color: white;line-height: 50px;display: flex;">
            <div style="height: 25px;width: 200px;">
                <el-select v-model="value" class="m-2" placeholder="Select">
                    <el-option v-for="item in categorys.data" :key="item.categoryName" :label="item.categoryName"
                        :value="item.id" />
                </el-select>
            </div>
            <div style="margin-right: 20px;">
                <el-date-picker v-model="value3" type="datetimerange" :shortcuts="shortcuts" range-separator="To"
                    start-placeholder="Start date" end-placeholder="End date" />
            </div>
            <div style="margin-right: 20px;">
                <el-input v-model="input1" class="w-50 m-2" size="large" placeholder="Please Input" :prefix-icon="Search" />
            </div>
            <div>
                <el-button type="primary" @click="search()">
                    搜索
                </el-button>
            </div>
        </div>

        <el-card v-for="(g, index) in goodss.goodss" :key="index" :body-style="{ padding: '0px' }"
            style="width: 205px;height: 310px; margin: 20px;">
            <img :src="'http://127.0.0.1:8001' + g.cover" class="image" fit="cover" style="width: 205px; height: 205px;" />
            <div style="padding: 14px">
                <span>{{ g.title }}</span>
                <div class="bottom">
                    <span style="font-size: small;">{{ g.content ? g.content.substring(0, 15) + '...' : '' }}</span>
                    <el-button text class="button" @click="dialogFormVisible = true, queryGoods(g.id)">详细信息</el-button>
                </div>
            </div>
        </el-card>
        <el-dialog v-model="dialogFormVisible" title="商品详细页" style="height: 650px;" width="600px">
            <!-- <el-table :data="gridData">
                <el-table-column property="date" label="Date" width="150" />
                <el-table-column property="name" label="Name" width="200" />
                <el-table-column property="address" label="Address" />
            </el-table> -->

            <div style="height: 480px;width: 560px;">
                <!-- <div style="width: 560px;height: 380px;">
                    <div style="width: 560px;height: 25px;">
                        <span>(售卖者：</span><span>{{ goods.data.userName }} ) </span>
                        <span>(价钱：￥</span><span>{{ goods.data.price }})</span>
                        <span>(商品类型：</span><span>{{ com }})</span>
                    </div>
                    <div style="width: 560px;height: 300px;">
                    </div>
                    <div style="width: 560px;height: 55px;">
                        <div>
                            交易地点：{{ goods.data.transactionAddress }}
                        </div>
                        <div>
                            交易时间：{{ goods.data.transactionDate }}

                        </div>
                    </div>
                </div> -->
                <el-descriptions title="Goods Info">
                    <el-descriptions-item label="售卖者：">{{ goods.data.userName }}</el-descriptions-item>
                    <el-descriptions-item label="价钱：￥">{{ goods.data.price }}</el-descriptions-item>
                    <el-descriptions-item label="商品类型：">
                        <el-tag size="small">{{ com }}</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="交易地点：">{{ goods.data.transactionAddress }}</el-descriptions-item>
                    <el-descriptions-item label="交易时间：">{{ goods.data.transactionDate }}</el-descriptions-item>
                </el-descriptions>
                <div style="width: 560px;height: 250px;">
                    <div style="width: 560px;height: 250px;">
                        <p>商品描述：{{ goods.data.content }}</p>
                    </div>
                </div>
                <div style="width: 560px;height: 100px;display: flex;flex-wrap: wrap;">
                    <div class="demo-image__preview" style="width: 100px; height: 100px; margin: 5px;"
                        v-for="(g, index) in goods.data.files" :key="index">
                        <el-image style="width: 100px; height: 100px" :src="'http://127.0.0.1:8001' + g.path"
                            :zoom-rate="1.2" :preview-src-list="goods.srcList" :initial-index="4" fit="cover" />
                    </div>
                </div>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">退出</el-button>
                    <el-button type="warning" @click="dialogFormVisible = false, buyGoods()">
                        购买
                    </el-button>
                    <el-button type="primary" @click="dialogFormVisible = false, open()">
                        聊一句吧
                    </el-button>
                </span>
            </template>
        </el-dialog>

    </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { defineStore, storeToRefs } from "pinia";
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive, ref, computed } from 'vue'
import axios from 'axios'
import { category, Response, Goods, file } from "../../util/clazz"
import { ReqChat, user } from "../../util/WebSocket"
import { testStore } from "../../stores/TestStore"
import { shortcuts} from '../../util/common' 

const store = testStore()
const UserData = store.testU
let { links, messagess } = storeToRefs(store)
let srcList: string[] = []
const dialogFormVisible = ref(false)
let data: category[] = []
let categorys = reactive({
    data: data
})
const com = computed(() => {
    for (let i = 0; i < categorys.data.length; i++) {
        if (categorys.data[i].id == goods.data.categoryId) {
            return categorys.data[i].categoryName
        }
    }
})
let good: Goods = new Goods

let goods = reactive({
    data: good,
    srcList: srcList,
    category: ''
})
let test: Goods[] = []
let status = reactive([])
let goodss = reactive({
    goodss: test
})
const value = ref('')
const value3 = ref('')
const input1 = ref('')
const categorylist = () => {
    axios.get('/goods/listGoodsCategory', {
    }).then(response => {
        if (response.data.code == 200) {
            categorys.data = response.data.data
            console.log(categorys)

        }
    })
    axios.get('/goods/listGoodsStatus', {
    }).then(response => {
        if (response.data.code == 200) {
            status = response.data.data
            console.log(status)

        }
    })

    axios.get('/goods/list/1/999', {params:{
        
    }
    }).then(response => {
        if (response.data.code == 200) {
            goodss.goodss = response.data.data.list
            console.log(response.data.data)
        }
    })

}
const queryGoods = (value: any) => {
    axios.get('/goods/queryGoodsById/' + value, {
    }).then(response => {
        if (response.data.code == 200) {
            goods.data = response.data.data
            goods.srcList = []
            for (let i = 0; i < goods.data.files.length; i++) {
                let s = 'http://127.0.0.1:8001' + goods.data.files[i].path
                goods.srcList.push(s)
            }
            console.log(goods.category)
            console.log(goods.srcList)
            console.log(goods.data.files)
        }
    })
}



categorylist()


const open = () => {
    ElMessageBox.prompt('请输入信息', '交流', {
        confirmButtonText: '发送',
        cancelButtonText: '返回',
        inputErrorMessage: '请输入',
    })
        .then(({ value }) => {
            if (value == null) {
                ElMessage({
                    type: 'error',
                    message: `message不可以为空`,
                })
            } else {


                let data = new ReqChat(UserData.id, goods.data.userId, value)
                axios.post('/chat/sendMessage', data).then(response => {
                    categorylist()
                    if (response.data.code == 200) {
                        goodss.goodss = response.data.data
                        console.log(goodss)
                        store.setLink(goods.data.userId, goods.data.userName)
                    }
                    ElMessage({
                        type: 'success',
                        message: `success：` + value,
                    })
                })
                categorylist()
            }
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: 'Input canceled',
            })
        })
}

const buyGoods = () => {
    ElMessageBox.prompt('请留下手机号码吧', 'Tip', {
        confirmButtonText: '购买',
        cancelButtonText: '返回',
        inputPattern:
            /^[1][3,4,5,6,7,8,9][0-9]{9}$/,
        inputErrorMessage: '输入正确手机号',
    })
        .then(({ value }) => {
            axios.post('/order/buyGoods', {
                goodsId: goods.data.id,
                buyerId: UserData.id,
                buyerPhone: value,
            }).then(response => {
                categorylist()
                if (response.data.code == 200) {
                    console.log(response.data.data)
                    ElMessage({
                        type: 'success',
                        message: `success`,
                    })
                } if (response.data.code == -1) {
                    ElMessage({
                        type: 'error',
                        message: response.data.error,
                    })
                }
            })
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: 'Input canceled',
            })
        })
}


const currentDate = ref(new Date())

const search = ()=>{
    axios.get('/goods/list/1/999', {params:{
        'keyword': input1.value,
        'startTime': value3.value[0],
        'endTime': value3.value[1],
        'categoryId':value.value
    }
    }).then(response => {
        if (response.data.code == 200) {
            goodss.goodss = response.data.data.list
            console.log(response.data.data)
        }
    })
}
search()


</script>

<style>
.time {
    font-size: 12px;
    color: #999;
}

.bottom {
    margin-top: 13px;
    line-height: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.button {
    padding: 0;
    min-height: auto;
}

.image {
    width: 100%;
    display: block;
}
</style>

