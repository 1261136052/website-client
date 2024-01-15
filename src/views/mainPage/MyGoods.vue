<template>
    <div style="background-color: white;width: 1000px;height: 660px;flex-wrap: wrap;display: flex;">
        <div style="width: 1000px;height: 50px;background-color: white;line-height: 50px;">
            <div style="width: 80px;height: 25px;"><el-button round @click="dialog = true">+新增商品</el-button></div>
        </div>
        <el-card v-for="(g, index) in goodss.goodss" :key="index" :body-style="{ padding: '0px' }"
            style="width: 205px;height: 310px; margin: 20px;">
            <img :src="'http://127.0.0.1:8001' + g.cover" class="image" fit="cover" style="width: 205px; height: 205px;" />
            <div style="padding: 14px">
                <span>{{ g.title }}</span>
                <div class="bottom">
                    <!-- <time class="time">{{ currentDate }}</time> -->
                    
                    <el-button type="primary" :icon="Edit" round
                        @click="upadteData(g.id), centerDialogVisible = true">修改</el-button>
                    <el-button @click="deleteDialog=true,deleteId = g.id" type="danger" :icon="Delete" round>删除</el-button>
                </div>
            </div>
        </el-card>

        <el-drawer ref="drawerRef" v-model="dialog" title="I have a nested form inside!" :before-close="handleClose"
            direction="ltr" class="demo-drawer">
            <div class="demo-drawer__content">
                <el-form :model="form">
                    <el-form-item label="商品名称" :label-width="formLabelWidth">
                        <el-input v-model="form.title" autocomplete="off" />
                    </el-form-item>
                    <el-form-item label="商品分类" :label-width="formLabelWidth">
                        <el-select v-model="form.categoryId" placeholder="Please select activity area">
                            <el-option v-for="(value, index) in categorys" :key="index" :label="value.categoryName"
                                :value="value.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品状态" :label-width="formLabelWidth">
                        <el-select v-model="form.status" placeholder="Please select activity area">
                            <el-option v-for="(value, index) in status" :key="index" :label="value" :value="value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品售价￥" :label-width="formLabelWidth">
                        <el-input-number v-model="form.price" :precision="2" :step="0.1" :max="9999" :min="0" />
                    </el-form-item>

                    <el-form-item label="商品描述" :label-width="formLabelWidth">
                        <el-input v-model="form.content" :rows="2" type="textarea" placeholder="Please input" />
                    </el-form-item>

                    <el-form-item label="商品图片" :label-width="formLabelWidth">
                        <!--  eslint-disable -->
                        <div>
                            <el-upload :disabled="maxSize" v-model:file-list="fileList"
                                action="http://127.0.0.1:8001/upload/upload" list-type="picture-card"
                                :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :headers=token
                                :on-success="onSuccess">
                                <el-icon>
                                    <Plus />
                                </el-icon>
                            </el-upload>

                            <el-dialog v-model="dialogVisible">
                                <img w-full :src="dialogImageUrl" alt="Preview Image" />
                            </el-dialog>
                        </div>
                    </el-form-item>

                    <el-form-item label="交易时间" :label-width="formLabelWidth">
                        <el-date-picker v-model="form.transactionDate" type="datetime" placeholder="Select date and time" />
                    </el-form-item>
                    <el-form-item label="交易地点" :label-width="formLabelWidth">
                        <el-input v-model="form.transactionAddress" autocomplete="off" />
                    </el-form-item>
                </el-form>
                <div class="demo-drawer__footer">
                    <el-button @click="cancelForm">Cancel</el-button>
                    <el-button type="primary" :loading="loading" @click="onClick">{{
                        loading ? 'Submitting ...' : 'Submit'
                    }}</el-button>
                </div>
            </div>
        </el-drawer>


        <el-dialog v-model="centerDialogVisible" title="Warning" width="30%" center>
            <span>
                修改此商品否？
            </span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="centerDialogVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="centerDialogVisible = false, dialog = true">
                        Confirm
                    </el-button>
                </span>
            </template>
        </el-dialog>


        <el-dialog v-model="deleteDialog" title="Warning" width="30%" center>
            <span>
                是否删除商品
            </span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="deleteDialog = false">Cancel</el-button>
                    <el-button type="primary" @click="deleteDialog = false,deleteGooods()">
                        Confirm
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, computed, markRaw, render } from 'vue'
import axios from 'axios'
import { ElDrawer, ElMessageBox, ElNotification } from 'element-plus'
import { testStore } from "../../stores/TestStore"
import { category, Response, Goods } from "../../util/clazz"
import {
    Delete, Edit, UploadFilled
} from '@element-plus/icons-vue'
import { tr } from 'element-plus/es/locale';
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps, UploadUserFile, UploadFiles, UploadFile } from 'element-plus'
import { sleep } from '../../util/check'
import { update } from 'lodash'
const store = testStore()
const UserData = store.testU
const table = ref(false)
let deleteDialog = ref(false)
const centerDialogVisible = ref(false)
const dialog = ref(false)
const loading = ref(false)
const currentDate = ref(new Date())
let timer
const formLabelWidth = '80px'
let categorys: category[] = reactive([])
let test: Goods[] = []
let status = reactive([])
let goodss = reactive({
    goodss: test
})
const categorylist = () => {
    axios.get('/goods/listGoodsCategory', {
    }).then(response => {
        if (response.data.code == 200) {
            categorys = response.data.data
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

    axios.get('/goods/listGoodsByUser', {
    }).then(response => {
        if (response.data.code == 200) {
            goodss.goodss = response.data.data
            console.log(goodss)
        }
    })

}

categorylist()
let form = reactive(new Goods)
form.userId = UserData.id
form.filesIds = []

const handleClose = (done) => {
    if (loading.value) {
        return
    }
    ElMessageBox.confirm('Do you want to submit?')
        .then(() => {
            loading.value = true
            timer = setTimeout(() => {
                done()
                // 动画关闭需要一定的时间
                setTimeout(() => {
                    loading.value = false
                }, 400)
            }, 2000)
        })
        .catch(() => {
            // catch error
        })
}

const drawerRef = ref<InstanceType<typeof ElDrawer>>()

const cancelForm = () => {
    loading.value = false
    dialog.value = false
    clearTimeout(timer)
}
const path = computed((val) => {
    return "http://127.0.0.1:8001" + val
})

let token: Record<string, any> = reactive({ 'token': UserData.token })
let fileList = ref<UploadUserFile[]>([

])
const onClick = () => {
    if (form.id != null) {
        axios.post('/goods/update', form).then(response => {
            if (response.status == 500) {
                console.log("a")
                ElNotification({
                    title: 'error',
                    message: response.status + '未知错误',
                    type: 'error',
                })
            }
            if (response.data.code == -1) {
                ElNotification({
                    title: 'error',
                    message: response.data.error,
                    type: 'error',
                })
            } else if (response.data.code == 200) {
                ElNotification({
                    title: 'Success',
                    message: '更新成功',
                    type: 'success',
                })

                categorylist()
                form = reactive(new Goods)
                form.userId = UserData.id
                form.filesIds = []
                fileList = ref<UploadUserFile[]>([

                ])
            }
            console.log(response.status)

        })
    }
    else {
        axios.post('/goods/add', form).then(response => {
            if (response.status == 500) {
                console.log("a")
                ElNotification({
                    title: 'error',
                    message: response.status + '未知错误',
                    type: 'error',
                })
            }
            if (response.data.code == -1) {
                ElNotification({
                    title: 'error',
                    message: response.data.error,
                    type: 'error',
                })
            } else if (response.data.code == 200) {
                ElNotification({
                    title: 'Success',
                    message: '添加成功',
                    type: 'success',
                })

                categorylist()
                form = reactive(new Goods)
                form.userId = UserData.id
                form.filesIds = []
                fileList = ref<UploadUserFile[]>([

                ])
            }
            console.log(response.status)

        })
    }
    console.log(form)
    drawerRef.value!.close()
}

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
let maxSize = ref(false)
const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
    /*  eslint-disable*/
    let res = uploadFile.response as Response
    let index = form.filesIds.indexOf(res.file.id)
    if (index > -1) {
        form.filesIds.splice(index, 1)
    }
    if (uploadFiles.length == 0) form.cover = ''
    console.log(uploadFile, uploadFiles, form.filesIds)
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
    dialogImageUrl.value = uploadFile.url!
    dialogVisible.value = true
}

const onSuccess = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
    if (uploadFiles.length >= 5) {
        maxSize = ref(true)
    }
    if (uploadFiles.length == 1) form.cover = response.file.path
    form.filesIds.push(response.file.id)
    console.log(response, uploadFile, uploadFiles, form.filesIds, fileList)
}


const upadteData = (val: any) => {
    axios.get('/goods/queryGoodsById/' + val, {
    }).then(response => {
        if (response.data.code == 200) {
            // form = new Goods
            form =reactive(response.data.data)
            form.filesIds = []
            console.log(form)
            console.log("succes")
        }
    })
    drawerRef.value!.close()
}
const deleteId = ref()
const deleteGooods  = ()=>{
    axios.get('/goods/delete/'+deleteId.value).then(response => {
            if (response.status == 500) {
                ElNotification({
                    title: 'error',
                    message: response.status + '未知错误',
                    type: 'error',
                })
            }
            if (response.data.code == -1) {
                ElNotification({
                    title: 'error',
                    message: response.data.error,
                    type: 'error',
                })
            } else if (response.data.code == 200) {
                ElNotification({
                    title: 'Success',
                    message: '删除成功',
                    type: 'success',
                })
                categorylist()
            }
            console.log(response.status)

        })
}
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

