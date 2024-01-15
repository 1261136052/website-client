<template>
    <div style="width: 1200px;height: 700px; background-color: #409EFF;overflow: hidden;">
           <div style="width: 600px;height: 500px; background-color: white;margin: auto;margin-top: 100px;">
               <div style="width: 600px;height:200px; font-size: 25px;box-sizing: border-box;padding-top: 60px;">
                   <!-- <el-icon>
                       <Search />
                   </el-icon> -->
                   <div style="width:600px;height: 60px;display: flex; justify-content:center;">
                       <div><el-image style="width: 50px; height: 50px" src="/logo.png" fit="fit" /></div>
                       <div> 欢迎来到校园易物</div>
                   </div>
               </div>
               <div style="width: 600px;height: 300px;">
                   <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="120px"
                       class="demo-ruleForm">
                       <el-form-item label="Account" prop="account">
                           <el-input style="width: 400px;" v-model="ruleForm.account" type="text" autocomplete="off" />
                       </el-form-item>
                       <el-form-item label="Password" prop="pass">
                           <el-input style="width: 400px;" v-model="ruleForm.pass" type="password" autocomplete="off" />
                       </el-form-item>
                       <el-form-item>
                           <el-button type="primary" @click="submitForm(ruleFormRef)">login</el-button>
                           <el-button @click="drawer = true">register</el-button>
                       </el-form-item>
                   </el-form>
   
   
                   <el-drawer v-model="drawer" title="I am the title" :with-header="false">
                       <el-form ref="ruleFormRef2" :model="ruleForm2" status-icon :rules="rules2" label-width="120px"
                           class="demo-ruleForm">
   
                           <el-form-item label="Account" prop="account">
                               <el-input v-model="ruleForm2.account" />
                           </el-form-item>
   
                           <el-form-item label="UserName" prop="userName">
                               <el-input v-model="ruleForm2.userName" />
                           </el-form-item>
   
                           <el-form-item label="Password" prop="pwd">
                               <el-input v-model="ruleForm2.pwd" type="password" autocomplete="off" />
                           </el-form-item>
                           <el-form-item label="Confirm" prop="checkPass">
                               <el-input v-model="ruleForm2.checkPass" type="password" autocomplete="off" />
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
                               <el-date-picker v-model="ruleForm2.birthday" type="datetime"
                                   placeholder="Select date and time" />
                           </el-form-item>
   
   
                           <el-form-item>
                               <el-button type="primary" @click="submitForm2(ruleFormRef2)">Submit</el-button>
                               <el-button @click="drawer = false">back</el-button>
                           </el-form-item>
                       </el-form>
                   </el-drawer>
               </div>
           </div>
       </div>
   </template>
   
   <script lang="ts" setup>
   import { reactive, ref, getCurrentInstance } from 'vue'
   import { FormInstance, FormRules, ElNotification, ElMessageBox } from 'element-plus'
   import axios from 'axios'
   import { useRoute, useRouter } from 'vue-router';
   
   import { defineStore, storeToRefs } from "pinia";
   import { testStore } from "../stores/TestStore"
   import * as MyModule from '../util/check';
   
   const store = testStore()
   let { UserData } = storeToRefs(store)
   const drawer = ref(false)
   const router = useRouter()
   const route = useRoute()
   
   const ruleFormRef = ref<FormInstance>()
   const ruleFormRef2 = ref<FormInstance>()
   
   const validatePass = (rule: any, value: any, callback: any) => {
       if (value === '') {
           callback(new Error('Please input the data'))
       } else {
           callback()
       }
   }
   const validatePass2 = (rule: any, value: any, callback: any) => {
       if (value === '') {
           callback(new Error('Please input the password again'))
       } else if (value !== ruleForm.pass) {
           callback(new Error("Two inputs don't match!"))
       } else {
           callback()
       }
   }
   
   const validatePass3 = (rule: any, value: any, callback: any) => {
       if (value === '') {
           callback(new Error('Please input the password'))
       } else {
           if (ruleForm.checkPass !== '') {
               if (!ruleFormRef2.value) return
               ruleFormRef2.value.validateField('checkPass', () => null)
           }
           callback()
       }
   }
   
   const validatePass4 = (rule: any, value: any, callback: any) => {
       if (value === '') {
           callback(new Error('Please input the password again'))
       } else if (value !== ruleForm2.pwd) {
           callback(new Error("Two inputs don't match!"))
       } else {
           callback()
       }
   }
   
   const ruleForm = reactive({
       pass: '',
       checkPass: '',
       age: '',
       account: ''
   })
   
   const ruleForm2 = reactive({
       account: '',
       pwd: '',
       checkPass: '',
       userName: '',
       schoolName: '',
       studentNumber: '',
       email: '',
       phoneNumber: '',
       birthday: ''
   })
   
   const rules = reactive<FormRules>({
       pass: [{ validator: validatePass, trigger: 'blur' }],
       checkPass: [{ validator: validatePass2, trigger: 'blur' }],
       account: [{ validator: MyModule.validateAccount, trigger: 'blur' }]
   })
   
   
   const rules2 = reactive<FormRules>({
       birthday: [{ validator: validatePass, trigger: 'blur' }],
       email: [{ validator: MyModule.checkEmail, trigger: 'blur' }],
       schoolName: [{ validator: validatePass, trigger: 'blur' }],
       studentNumber: [{ validator: MyModule.checkStudentNumber, trigger: 'blur' }],
       account: [{ validator: MyModule.checkAccount, trigger: 'blur' }],
       userName: [{ validator: MyModule.checkAccount, trigger: 'blur' }],
       pwd: [{ validator: validatePass3, trigger: 'blur' }],
       checkPass: [{ validator: validatePass4, trigger: 'blur' }],
       phoneNumber: [{ validator: MyModule.checkPhoneNumber, trigger: 'blur' }]
   })
   
   
   const submitForm = (formEl: FormInstance | undefined) => {
       if (!formEl) return
       formEl.validate((valid) => {
           if (valid) {
               axios.post('/user/login', {
                   account: ruleForm.account,
                   pwd: ruleForm.pass
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
                           path: '/main/main',
                       })
                   }
                   console.log(response.status)
   
               })
   
               console.log('submit!')
           } else {
               console.log('error submit!')
               return false
           }
       })
   }
   
   const submitForm2 = (formEl: FormInstance | undefined) => {
       if (!formEl) return
       formEl.validate((valid) => {
           if (valid) {
               axios.post('/user/register', ruleForm2).then(response => {
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
                           message: '注册失败',
                           type: 'error',
                       })
                   } else if (response.data.code == 200) {
                       ElNotification({
                           title: 'Success',
                           message: '注册成功',
                           type: 'success',
                       })
   
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
   
   </script>
   
   <style lang="scss" scoped>
   
   </style>