<template>
  <div class="common-layout">
    <el-container style="height: 660px;">
      <el-aside width="200px" style="background-color: #a0cfff;">
        <div style="width: 180px;height: 50px;margin-top: 10px;" v-for="(g, index) in linkss" :key="index">
          <el-button style="width: 180px;height: 50px;" type="primary" @click="getMessage(g.id, g.userName)">{{ g.userName
          }}</el-button>
        </div>
      </el-aside>
      <el-container>
        <el-header style="background-color: #79bbff;"></el-header>
        <el-main style="background-color: #ecf5ff;">
          <div style="width: 750px;height: 350px;background-color: #79bbff;overflow: hidden; ">
            <el-scrollbar height="350px" ref="scrollbarRef" always>
              <div ref="innerRef">
                <div style="width: 750x;height: auto;margin-top: 5px;" v-for="mes in goData.message" :key="mes.content">
                  <div v-if="mes.readerId == UserDataRect.id"
                    style="margin-left: 450px;width: 300px;height: auto;background-color: #95d475;  border-radius: 4px;">
                    <span>{{ UserDataRect.userName }}--- {{ mes.publishDate }}</span>
                    <p class="scrollbar-demo-item">{{ mes.content }}</p>
                  </div>

                  <div v-else style="width: 300px;height: auto;background-color: #95d475;   border-radius: 4px;">
                    <span>{{ goData.userName }} --- {{ mes.publishDate }}</span>
                    <p class="scrollbar-demo-item">{{ mes.content }}</p>
                  </div>
                </div>
              </div>
            </el-scrollbar>
            <!-- <el-scrollbar>
              <div style="width: 750x;height: auto;margin-top: 5px;" v-for="mes in goData.message" :key="mes.content">
                <div v-if="mes.readerId == UserDataRect.id"
                  style="margin-left: 450px;width: 300px;height: auto;background-color: #95d475;  border-radius: 4px;">
                  <span>{{ UserDataRect.userName }}--- {{ mes.publishDate }}</span>
                  <p class="scrollbar-demo-item">{{ mes.content }}</p>
                </div>

                <div v-else style="width: 300px;height: auto;background-color: #95d475;   border-radius: 4px;">
                  <span>{{ goData.userName }} --- {{ mes.publishDate }}</span>
                  <p class="scrollbar-demo-item">{{ mes.content }}</p>
                </div>
              </div>
            </el-scrollbar> -->
          </div>
          <div style="width: 750px;height: 180px;">
            <div>
              <span v-for="emoji in goData.emojis" :key="emoji" @click="addEmoji(emoji)">{{ emoji }}</span>
            </div>
            <el-input v-model="textarea" :rows="4" type="textarea" placeholder="Please input" />
            <div><el-button type="primary" round @click="send()">发送信息</el-button></div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox, ElScrollbar as ElScrollbarType  } from 'element-plus'
import { defineStore, storeToRefs } from "pinia";
import { reactive, ref, onBeforeUnmount, nextTick, watch,queuePostFlushCb } from 'vue'
import { Menu as IconMenu, Message, Setting } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router';
import { testStore } from "../../stores/TestStore"
import axios from 'axios'
import { message, messages, user, WebSocketClient, ReqChat } from '../../util/WebSocket'
const textarea = ref('')
const store = testStore()
let { links, messagess, newMessage, ws } = storeToRefs(store)
console.log(links)


const innerRef = ref<HTMLDivElement>()
const scrollbarRef = ref<InstanceType<typeof ElScrollbarType>>()

const UserData = store.testU
const UserDataRect = reactive(UserData)
const router = useRouter()
const route = useRoute()
// let ws: WebSocketClient
let a: message[] = []
let linkss: user[] = links.value.data
let data: Map<bigint, message[]> = messagess.value.data

let goData = reactive({
  message: a,
  linkss: linkss,
  userName: "",
  userId: 12345678901234567890n,
  emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉'],
})

const getMessage = (val: any, val1: any) => {
  let temp: message[] = data.get(val) as message[]
  if (data.get(val) == null) {
    axios.get('/chat/getMessageList/' + val, {
    }).then(response => {
      if (response.data.code == 200) {
        goData.message = response.data.data
        data.set(val, goData.message)
        console.log(goData.message)
      }
    })

  } else {
    goData.message = temp
    console.log("not null")
  }
  goData.userName = val1
  goData.userId = val
}
// watch(
//   () => store.count,
//   (newValue, oldValue) => {
//     console.log(`count 变化了，从 ${oldValue} 变为 ${newValue}`);
//   }
// );
const send = () => {
  if (textarea.value == '') {
    ElMessage({
      duration: 3000,
      message: "不可以发送空内容",
      type: 'error',
    })
    return;
  } if (goData.userId == 12345678901234567890n) {
    ElMessage({
      duration: 3000,
      message: "请选择目标用户",
      type: 'error',
    })
    textarea.value = ''
    return;
  }

  let push = new ReqChat(UserData.id, goData.userId, textarea.value)
  axios.post('/chat/sendMessage', push).then(response => {
    if (response.data.code == 200) {
      let inData: message = response.data.data as message
      data.get(inData.listenerId)!.push(inData)
      console.log(inData)
      func1()
    }
    ElMessage({
      type: 'success',
      message: `发送成功`,
    })
  })
  textarea.value = ''
}
watch(() => goData.message,
  (newValue, oldValue) => {
    console.log(oldValue, newValue);
    func1()


  }
)



const func1 = ()=>{
  nextTick(() => {
    if (innerRef.value!.clientHeight > 350) {
      scrollbarRef.value!.setScrollTop(innerRef.value!.clientHeight)
    }
  })
}
// const func1 = ()=>{
//   WebSocketClient.websocket!.onmessage = (event) => {
//     if ('ping' != event.data) {
//       let message: message = JSON.parse(event.data) as message
//       pushData(message)
//       console.log(messagess.value.data)
//       ElMessage({
//         duration: 30000,
//         message: message.content,
//         type: 'warning',
//       })
//       console.log('WebSocket message received: ' + event.data);
//     } else {
//       console.log('WebSocket hold on');
//     }
//   };
// }
// func1()
const addEmoji = (val) => {
  textarea.value += val
}
</script>


<style scoped>
.scrollbar-demo-item {
  display: inline-block;
  max-width: 300px;
  min-width: 280px;
  word-wrap: break-word;
  align-items: center;
  justify-content: center;
  max-height: 500px;
  margin: 5px 0px 10px 10px;
  text-align: left;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
</style>


