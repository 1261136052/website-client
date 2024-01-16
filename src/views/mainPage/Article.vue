


<template>
  <div>
    <el-dialog v-model="dialogFormVisible" title="文章内容">
      <el-form :model="form.addData">
        <el-form-item label="文章标题" :label-width="formLabelWidth">
          <el-input v-model="form.addData.title" autocomplete="off" />
        </el-form-item>
        <el-form-item label="文章类型" :label-width="formLabelWidth">
          <el-select v-model="form.addData.articleCategoryId" placeholder="Please select a zone">
            <el-option v-for="c in form.category" :key="c" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="文章封面" :label-width="formLabelWidth">
          <el-upload class="avatar-uploader" action="http://127.0.0.1:8001/upload/upload" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :headers=token>
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item label="文章内容" :label-width="formLabelWidth">
          <vue-quill-text-editor ref="quillRef" :placeholder="place" style="height: 200px;" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">Cancel</el-button>
          <el-button type="primary" @click="dialogFormVisible = false, add()">
            Confirm
          </el-button>
        </span>
      </template>
    </el-dialog>
    <div style="width: 1000px;height: 50px;background-color: white;line-height: 50px;display: flex;">

      <div style="width: 80px;height: 25px;"><el-button text @click="dialogFormVisible = true">+发布文章</el-button>
      </div>

      <div style="height: 25px;width: 200px;">
        <el-select v-model="value" class="m-2" placeholder="Select" size="large">
          <el-option v-for="item in form.category" :key="item.id" :label="item.name" :value="item.id" />
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
    <div style="max-height:590px;overflow:auto" infinite-scroll-distance='100' infinite-scroll-immediate="false"
      v-infinite-scroll="load">
      <el-table :data="data.data" stripe style="width: 100% ;">
        <el-table-column prop="cover" label="封面">
          <template #default="scope">
            <el-avatar shape="square" :size="100" fit="fit" :src="'http://127.0.0.1:8001' + scope.row.cover" />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" width="180" />
        <el-table-column prop="author" label="作者" width="180" />
        <el-table-column prop="publishDate" label="发布时间" />


        <el-table-column fixed="right" label="操作" width="60">
          <template #default="scope">
            <el-button link type="primary" size="small"
              @click="detail(scope.$index, scope.row), dialogTableVisible = true">Detail</el-button>
          </template>
        </el-table-column>
      </el-table>
      <p v-if="loading">Loading...</p>
      <p v-if="noMore">No more</p>
    </div>
    <el-dialog v-model="dialogTableVisible" title="文章内容">
      <el-descriptions title="文章信息">
        <el-descriptions-item label="标题">{{ form.article.title }}</el-descriptions-item>
        <el-descriptions-item label="作者">{{ form.article.author }}
          <el-icon size="20" :color="color2" @click="attention()">
            <Pointer />
          </el-icon>
        </el-descriptions-item>
        <el-descriptions-item label="发布时间">{{ form.article.publishDate }}</el-descriptions-item>
        <el-descriptions-item label="文章类型">
          <el-tag size="small">{{ com }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="点赞">
          <el-icon size="20" :color="color" @click="like()">
            <Star />
          </el-icon>
        </el-descriptions-item>

        <el-descriptions-item label="点赞数量">
          {{ form.article.likeCount }}
        </el-descriptions-item>

        <el-descriptions-item label="评论数量">
          {{ form.article.commentCount }}
        </el-descriptions-item>
        <!-- <el-descriptions-item label="Address">No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu
                              Province</el-descriptions-item> -->
      </el-descriptions>

      <div style="width: 560px;height: 350px;" v-html="form.article.content">

      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogTableVisible = false">退出</el-button>
          <el-button type="primary" @click="dialogTableVisible = false, commentDialog = true,loadMsg()">
            聊一句吧
          </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="commentDialog" :title="form.article.title">



      <div  v-for="i in form.messages" style="width: 300px;height: auto;background-color: #95d475;   border-radius: 4px;margin-top: 5px;">
        <span>{{ i.userName}} --- {{i.sendDate }}</span>
        <p class="scrollbar-demo-item">{{ i.content}}</p>
      </div>

      <div class="example-pagination-block">

        <el-pagination layout="prev, pager, next" v-model:current-page="commentPageNum" :page-count="commentPageCount"
            @change="loadMsg()" />
        <div>
          <div>
            <span v-for="emoji in form.emojis" :key="emoji" @click="addEmoji(emoji)">{{ emoji }}</span>
          </div>
          <el-input v-model="textarea" :rows="4" type="textarea" placeholder="Please input" />
          <div><el-button type="primary" round @click="send()">发送信息</el-button></div>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import axios from 'axios'
import { computed, ref, reactive, watch, toRefs, defineComponent } from 'vue'
import { article, category2 } from "../../util/clazz"
import { defineStore, storeToRefs, } from "pinia";
import { ElMessage, ElNotification } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { testStore } from "../../stores/TestStore"
import type { UploadProps } from 'element-plus'
import { template } from 'lodash';
import { shortcuts } from '../../util/common'
import { message2 } from '../../util/WebSocket'
const color2 = ref("black")
const commentPageCount = ref(0)
const commentPageNum = ref(1)

// const commentTotal= ref(0)
const loadMsg = ()=>{
// commentPageNum.value += val
  axios.get('/comment/query/'+form.article.id+"/"+commentPageNum.value+"/"+"5",{
    params: {
      "content":textarea.value
    }
  } ).then(response => {
    if (response.data.code == 200) {
      form.messages = response.data.data.list as message2[]
      commentPageCount.value = response.data.data.pager.pageCount 
      console.log(commentPageNum.value)
      console.log(response.data.data)
    }

  })
}




const send = ()=>{
  axios.get('/comment/comment/'+form.article.id,{
    params: {
      "content":textarea.value
    }
  } ).then(response => {
    if (response.data.code == 200) {
      // search()
      form.addData = new article()
      loadMsg()
      console.log(response.data.data)
      ElNotification({
        title: 'success',
        message: '添加成功',
        type: 'success',
      })
    }
    if (response.data.code == -1) {
      ElNotification({
        title: 'error',
        message: response.data.error,
        type: 'error',
      })
    }
    textarea.value=""
  })
}


const textarea = ref()
const commentDialog = ref(false)
const state = reactive({
  fits: ['fill', 'contain', 'cover', 'none', 'scale-down'],
  url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
})

const { fits, url } = toRefs(state)
const color = ref('red')
const input1 = ref('')
const value3 = ref('')
const value = ref('')
const defaultTime = new Date(2000, 1, 1, 12, 0, 0)
const dialogFormVisible = ref(false)
const com = computed(() => {
  for (let i = 0; i < form.category.length; i++) {
    if (form.category[i].id == form.article.articleCategoryId) {
      return form.category[i].name
    }
  }
})

const dialogTableVisible = ref(false)
const formLabelWidth = '140px'
const articleAdd = new article()
const articles: article[] = []
const category: category2[] = []
const messages: message2[] = []
const form = reactive({
  addData: articleAdd,
  category: category,
  article: articleAdd,
  messages: messages,
  emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉'],
})

const data = reactive({
  data: articles
})
const func1 = () => {
  axios.get('/article/categorys', {
  }).then(response => {
    if (response.data.code == 200) {
      form.category = response.data.data as category2[]
      console.log(response)
    }
  })
  // axios.get('/article/list/1/999', {

  // }).then(response => {
  //   if (response.data.code == 200) {
  //     data.data = response.data.data.list as article[]
  //     console.log(response.data.data.list)
  //   }
  // })

}
func1()

const addEmoji = (val) => {
  textarea.value += val
}


const store = testStore()
let { UserData } = storeToRefs(store)
let token: Record<string, any> = reactive({ 'token': UserData.value.token })
const imageUrl = ref('')

const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
  form.addData.cover = response.file.path
  console.log(response, uploadFile, form.addData.cover)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}

const add = () => {
  form.addData.author = UserData.value.userName
  form.addData.authorId = UserData.value.id
  axios.post('/article/add', form.addData).then(response => {
    if (response.data.code == 200) {
      // search()
      form.addData = new article()
      console.log(response.data.data)
      ElNotification({
        title: 'success',
        message: '添加成功',
        type: 'success',
      })
    }
    if (response.data.code == -1) {
      ElNotification({
        title: 'error',
        message: response.data.error,
        type: 'error',
      })
    }
  })
  console.log(form.addData)
  form.addData = new article()
}

const place = "1231"
const quillRef = ref();
watch(quillRef, async (val) => {
  const quillInstance = val.quillInstance;
  quillInstance.enable(true);
  quillInstance.on('text-change', () => {
    // get html content
    const content = quillInstance.container.firstChild.innerHTML;

    form.addData.content = content
    console.log('quill content: ', content);
  });
  // set html content
  quillInstance.container.firstChild.innerHTML = "";

});


const loadArticle = (articleId) => {
  axios.get('/article/load/' + articleId, {
  }).then(response => {
    if (response.data.code == 200) {
      form.article = response.data.data as article
      isAttention()
    }
  })

}

const detail = (index, row) => {
  loadArticle(row.id)
  axios.get('/like/query/' + row.id + "/" + UserData.value.id, {
  }).then(response => {
    if (response.data.code == 200) {
      if (!response.data.data) {
        color.value = "black"
        console.log(color)
      } else {
        color.value = "red"
      }
    }
  })


}

const isAttention = ()=>{
  axios.get('/attention/isAttention/' +UserData.value.id+ "/" +form.article.authorId, {
  }).then(response => {
    if (response.data.code == 200) {
      if (!response.data.data) {
        color2.value = "black"
        console.log(color)
      } else {
        color2.value = "red"
      }
    }
  })
}
const like = () => {
  axios.get('/like/like/' + form.article.id + "/" + UserData.value.id, {
  }).then(response => {
    if (response.data.code == 200) {
      if (!response.data.data) {
        color.value = "black"
        ElMessage({
          type: 'error',
          message: `取消点赞成功`,
        })
      } else {
        color.value = "red"
        ElMessage({
          type: 'success',
          message: `点赞成功`,
        })
      }
      loadArticle(form.article.id)
    }
  })
}



const attention = () => {
  axios.get('/attention/addOrCancel/' + UserData.value.id+ "/" +form.article.authorId, {
  }).then(response => {
    if (response.data.code == 200) {
      if (!response.data.data) {
        color2.value = "black"
        ElMessage({
          type: 'error',
          message: `取消关注成功`,
        })
      } else {
        color2.value = "red"
        ElMessage({
          type: 'success',
          message: `关注成功`,
        })
      }
    }
  })
}

var pageNum: number = 1
var noMore: boolean = false
const search = () => {
  pageNum = 1
  console.log(value3.value[0])
  axios.get('/article/list/' + pageNum + '/5', {
    params: {
      'keyword': input1.value,
      'startTime': value3.value[0],
      'endTime': value3.value[1],
      'categoryId': value.value
    }
  }).then(response => {
    if (response.data.code == 200) {
      data.data = response.data.data.list as article[]
      // console.log(response.data.data.list)
    }
  })
}
search()
const load = () => {
  if (!noMore && !loading.value) {
    loading.value = true
    pageNum += 1
    axios.get('/article/list/' + pageNum + '/5', {
      params: {
        'keyword': input1.value,
        'startTime': value3.value[0],
        'endTime': value3.value[1],
        'categoryId': value.value
      }
    }).then(response => {
      if (response.data.code == 200) {

        console.log(response.data)
        if (response.data.data.list.length == 0) {
          noMore = true
          return;
        }
        setTimeout(() => {
          for (let i of response.data.data.list) {
            data.data.push(i as unknown as article)
          }
          loading.value = false
        }, 2000)
        // data.data.push()
        console.log("loda")
        console.log(response.data.data.list)
      }
    })
  }
}
const loading = ref(false)
const disabled = computed(() => loading.value || noMore)



</script>
<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}






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

