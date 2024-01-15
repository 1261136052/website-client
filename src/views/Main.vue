<template>
    <el-container class="layout-container-demo" style="width: 1200px;height: 700px; background-color: white;padding: 0;">
        <el-aside width="200px">
            <el-scrollbar>
                <el-menu :default-openeds="['1', '3']">
                    <el-sub-menu index="1">
                        <template #title>
                            <el-icon>
                                <Avatar />
                            </el-icon>我的
                        </template>
                        <el-menu-item-group>
                            <!-- <template #title>Group 1</template> -->
                            <el-menu-item index="1-1" @click="go('/main/order')">我的订单</el-menu-item>
                            <el-menu-item index="1-2" @click="go('/main/message')">信息通知</el-menu-item>
                            <el-menu-item index="1-3" @click="go('/main/mygoods')">我的闲置</el-menu-item>
                            <el-menu-item index="1-3" @click="go('/main/Temple')">个人主页</el-menu-item>
                        </el-menu-item-group>
                    </el-sub-menu>
                    <el-sub-menu index="2">
                        <template #title>
                            <el-icon>
                                <Goods />
                            </el-icon>校园闲置市场
                        </template>
                        <el-menu-item-group>
                            <!-- <template #title>Group 1</template> -->
                            <el-menu-item index="2-1" @click="go('/main/goodscards')">闲置优品</el-menu-item>
                        </el-menu-item-group>
                    </el-sub-menu>
                    <el-sub-menu index="3">
                        <template #title>
                            <el-icon>
                                <Flag />
                            </el-icon>闲置论坛
                        </template>
                        <el-menu-item-group>
                            <!-- <template #title>Group 1</template> -->
                            <el-menu-item index="3-1" @click="go('/main/article')">闲置交流论坛</el-menu-item>
                        </el-menu-item-group>
                        <el-menu-item-group>
                            <el-menu-item index="3-2" @click="go('/main/hotArticle')">热门帖子</el-menu-item>
                        </el-menu-item-group>
                    </el-sub-menu>
                </el-menu>
            </el-scrollbar>
        </el-aside>

        <el-container>
            <el-header style="text-align: right; font-size: 12px;width: 1000px;">
                <div class="toolbar">
                    <el-dropdown>
                        <el-icon style="margin-right: 8px; margin-top: 1px">
                            <setting />
                        </el-icon>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="go('/main/main')">首页</el-dropdown-item>
                                <el-dropdown-item @click="drawer = true, getUserData()">修改个人信息</el-dropdown-item>
                                <el-dropdown-item @click="dialogFormVisible = true">登录</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                    <span>{{ UserDataRect.userName }}</span>
                </div>
            </el-header>

            <el-main>
                <el-scrollbar>
                    <!-- <el-table :data="tableData">
                        <el-table-column prop="date" label="Date" width="140" />
                        <el-table-column prop="name" label="Name" width="120" />
                        <el-table-column prop="address" label="Address" />
                    </el-table> -->
                    <router-view></router-view>
                </el-scrollbar>
            </el-main>
        </el-container>


        <el-dialog v-model="dialogFormVisible" title="Shipping address">
            <el-form :model="form">
                <el-form-item label="account" :label-width="formLabelWidth">
                    <el-input v-model="form.account" autocomplete="off" />
                </el-form-item>
                <el-form-item label="pass word" :label-width="formLabelWidth">
                    <el-input v-model="form.pwd" autocomplete="off" type="password" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="dialogFormVisible = false,fakeLogin()">
                        Confirm
                    </el-button>
                </span>
            </template>
        </el-dialog>

        <el-drawer v-model="drawer" title="I am the title" :with-header="false">
            <el-form ref="ruleFormRef2" :model="ruleForm2" status-icon :rules="rules2" label-width="120px"
                class="demo-ruleForm">

                <el-form-item label="UserName" prop="userName">
                    <el-input v-model="ruleForm2.userName" />
                </el-form-item>

                <el-form-item label="PhoneNumber" prop="phoneNumber">
                    <el-input v-model.number="ruleForm2.phoneNumber" />
                </el-form-item>

                <el-form-item label="SchoolName" prop="schoolName">
                    <el-select v-model="ruleForm2.schoolName" class="m-2" placeholder="Select" size="large">
                        <el-option v-for="item in MyModule.options" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="StudentNumber" prop="studentNumber">
                    <el-input v-model.number="ruleForm2.studentNumber" />
                </el-form-item>
                <el-form-item label="Email" prop="email">
                    <el-input v-model="ruleForm2.email" />
                </el-form-item>
                <el-form-item label="Birthday" prop="birthday">
                    <el-date-picker v-model="ruleForm2.birthday" type="datetime" placeholder="Select date and time" />
                </el-form-item>


                <el-form-item>
                    <el-button type="primary" @click="submitForm2(ruleFormRef2)">Submit</el-button>
                    <el-button @click="drawer = false">back</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>

    </el-container>
</template>

<script lang="ts" setup>
import { FormInstance, FormRules, ElNotification, ElMessage } from 'element-plus'
import { defineStore, storeToRefs } from "pinia";
import { reactive, ref, onBeforeUnmount, watch } from 'vue'
import { Menu as IconMenu, Message, Setting } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router';
import { testStore } from "../stores/TestStore"
import axios from 'axios'
import { WebSocketClient, message } from '../util/WebSocket'
import { sleep } from "../util/check"
import * as MyModule from '../util/check';






const dialogFormVisible = ref(false)
const formLabelWidth = '140px'

const form = reactive({
    account: "",
    pwd: ""
})



const fakeLogin = () => {
    if (form.account == "" || form.pwd == "") {
        ElNotification({
            title: 'error',
            message:  '账号密码不可为空',
            type: 'error',
        })
        return
    }
    axios.post('/user/login', {
        account: form.account,
        pwd: form.pwd
    }).then(response => {
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
                message: '账号或密码错误',
                type: 'error',
            })
        } else if (response.data.code == 200) {
            ElNotification({
                title: 'Success',
                message: '登录成功',
                type: 'success',
            })
            store.testA(response.data.data)
            router.push({
                path: '/main/article',
            })
        }
        console.log(response.status)

    })
}





const store = testStore()
let { links, newMessage, } = storeToRefs(store)
var UserData = store.testU
const UserDataRect = reactive(UserData)
const router = useRouter()
const route = useRoute()
const func1 = () => {
    if (UserData.token == '') {
        router.push({
            path: '/',

        })
    }
    axios.defaults.headers["token"] = UserData.token;
    let url: string = 'ws://127.0.0.1:8001/myService/' + UserData.id
    // intense.sendMessage("s")
    let intense: WebSocketClient = new WebSocketClient(url)
    store.setWS(intense)
    intense.open()
    console.log("sleep")
    setTimeout(() => {
        WebSocketClient.websocket!.onmessage = (event) => {
            if ('ping' != event.data) {
                let json = event.data
                json = json.replace(/:s*([0-9]{15,})s*(,?)/g, ': "$1" $2')
                let data: message = JSON.parse(json) as message
                if (data.listenerId != data.readerId) {
                    (store as any).setMessage(data)
                }
                ElMessage({
                    duration: 30000,
                    message: data.content,
                    type: 'warning',
                })
                console.log('WebSocket message received: ' + event.data);
            } else {
                console.log('WebSocket hold on');
            }
        };
    }, 1000);

    axios.get('/chat/getLinks', {
    }).then(response => {
        if (response.data.code == 200) {
            links.value.data = response.data.data
            console.log(store.getLinks)
        }
    })
}
func1()
// console.log("start")
// let a = store.getWS()
// console.log(a)

const go = (val: string) => {
    router.push({
        path: val,
    })
}
const item = {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
}
const tableData = ref(Array.from({ length: 20 }).fill(item))

const token = UserData.token
window.addEventListener('beforeunload', function () {
    // 可以在这里做一些事情，例如向服务器发起同步的请求
    // debugger
    // axios.defaults.headers["token"] = UserData.token;
    // WebSocketClient.close()
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://127.0.0.1:8001/user/down', false); // 将async设置为false即可发送同步请求
    xhr.setRequestHeader('token', UserData.token);
    xhr.send(null);
    if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
            console.log(xhr.responseText);
        } else {
            console.log(xhr.status);
        }
    }


    return true
})
// const beforeUnmount = onBeforeUnmount(() => {
//     axios.get('/user/down', {
//     }).then(response => {

//     })
// })
// 处理消息事件
const drawer = ref(false)
const ruleFormRef2 = ref<FormInstance>()
const ruleForm2 = reactive({
    id: '',
    userName: '',
    schoolName: '',
    studentNumber: '',
    email: '',
    phoneNumber: '',
    birthday: ''
})
const validatePass = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('Please input the data'))
    } else {
        callback()
    }
}
const rules2 = reactive<FormRules>({
    birthday: [{ validator: validatePass, trigger: 'blur' }],
    email: [{ validator: MyModule.checkEmail, trigger: 'blur' }],
    schoolName: [{ validator: validatePass, trigger: 'blur' }],
    studentNumber: [{ validator: MyModule.checkStudentNumber, trigger: 'blur' }],
    userName: [{ validator: MyModule.checkAccount, trigger: 'blur' }],
    phoneNumber: [{ validator: MyModule.checkPhoneNumber, trigger: 'blur' }]
})


const submitForm2 = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            axios.post('/user/updateUserData', ruleForm2).then(response => {
                if (response.status != 200) {
                    ElNotification({
                        title: 'error',
                        message: response.status + '未知错误',
                        type: 'error',
                    })
                }
                if (response.data.code == -1) {
                    ElNotification({
                        title: 'error',
                        message: '修改失败',
                        type: 'error',
                    })
                } else if (response.data.code == 200) {
                    ElNotification({
                        title: 'Success',
                        message: '修改成功准备刷新页面',
                        type: 'success',
                    })
                    setTimeout(() => {
                        location.reload()
                    }, 2000)

                }
                console.log(response)
            })
            console.log('submit!')
        } else {
            console.log('error submit!')
            return false
        }
    })
}
const getUserData = () => {
    axios.get('/user/getUserData').then(response => {
        if (response.status == 200) {
            ruleForm2.userName = response.data.data.userName
            ruleForm2.phoneNumber = response.data.data.phoneNumber
            ruleForm2.birthday = response.data.data.birthday
            ruleForm2.schoolName = response.data.data.schoolName
            ruleForm2.studentNumber = response.data.data.studentNumber
            ruleForm2.email = response.data.data.email
            ruleForm2.id = UserData.id.toString()
        }
        console.log(response)
    })
}
</script>


<style scoped>
.layout-container-demo .el-header {
    margin-top: 0px;
    width: 1200px;
    position: relative;
    background-color: var(--el-color-primary-light-7);
    color: var(--el-text-color-primary);
}

.layout-container-demo .el-aside {
    color: var(--el-text-color-primary);
    background: var(--el-color-primary-light-8);
}

.layout-container-demo .el-menu {
    border-right: none;
}

.layout-container-demo .el-main {
    padding: 0;
}

.layout-container-demo .toolbar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    right: 20px;
}

.demo-image__error .image-slot {
    font-size: 30px;
}

.demo-image__error .image-slot .el-icon {
    font-size: 30px;
}

.demo-image__error .el-image {
    width: 100%;
    height: 200px;
}
</style>

