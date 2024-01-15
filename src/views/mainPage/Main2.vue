<template>
  <div>
    <!-- <el-carousel :interval="5000" arrow="always" height="500px">
      <el-carousel-item v-for="item in srcList.list" :key="item">
        <el-image :src="item.src" fit="fit" />
      </el-carousel-item>

    </el-carousel> -->

    <el-carousel :interval="4000" type="card" height="200px">
      <el-carousel-item v-for="item in srcList.list" :key="item">
        <!-- <h3 text="2xl" justify="center">{{ item }}</h3> -->
        <el-image :src="item.src" fit="fit" />
      </el-carousel-item>
    </el-carousel>
    <div style="width: 1000px;height: 350px;">
      <p><el-text tag="b" size="large" type="primary">
        <el-image style="width: 35px; height: 35px" src="/logo.png" fit="fit" />
          网站简介
        </el-text></p>
      <p><el-text tag="b" size="large">
          “校园易物”，一款基于Web的交易平台，专注于提供校园中二手物品和交流平台。用户可以在该平台上发布和购买二手闲置物品，通过点对
          点聊天室与卖家或买家沟通，并在校园内约定面对面交易的时间和地点。该平台还提供了交流文章的功能，用户可以共享他们的经验和知识，
          并在文章下方进行评论和讨论。我们致力于提供一个安全、便捷、可靠的交易平台，为学生们提供更好的交易和交流体验。
        </el-text></p>
      <p><el-text tag="b" size="large">
          “校园易物”不仅提供了交易平台，而且也是在低碳生活方面的贡献者。通过购买和出售二手闲置物品，我们可以减少生产新产品所需的能源和资源消耗，
          同时减少废弃物的产生。此外，在校园内进行面对面交易可以减少物流时间和成本，并减少对环境造成的不良影响。最重要的是，该平台可以鼓励学生之间互相分享和学习，
          在环保教育和文化的推广方面也具有一定的促进作用。因此，我们相信，“校园易物”将为学生提供更加可持续和环保的生活方式，让我们共同致力于建设更美好的环境和社会。
        </el-text></p>
      <p><el-text tag="b" size="large">
          考虑到近期提出了碳中和的目标，我们也将在“校园易物”平台上加入这一政策。我们将继续通过二手交易和面对面交易，减少新产品的生产和物流的能源消耗和碳排放，
          并鼓励用户采用可持续的生活方式。此外，我们还将探索其他减少碳排放的措施，如采用可再生能源，减少不必要的电力和能源消耗等等。我们相信，“校园易物”平台可
          以成为符合碳中和政策的重要贡献者，同时也能为学生们提供更加环保、可持续的生活方式。
        </el-text></p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { defineStore, storeToRefs } from "pinia";
import { reactive, ref, computed, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { testStore } from "../../stores/TestStore"

const srcList = reactive({
  list: [
    {
    id: 1,
    src: new URL('../../assets/test2.jpg', import.meta.url).href,
  }, {
    id: 2,
    src: new URL('../../assets/test1.jpg', import.meta.url).href,
  },
   {
    id: 3,
    src: new URL('../../assets/test3.jpg', import.meta.url).href,
  },
  ]
})

const fun1 = () => {

}

fun1()

</script>


<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>


