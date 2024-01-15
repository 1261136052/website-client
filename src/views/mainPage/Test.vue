<!-- <template>
  <div class="emoji-input">
    <input type="text" v-model="message" />
    <div class="emoji-panel">
      <span v-for="emoji in emojis" :key="emoji" @click="addEmoji(emoji)">{{ emoji }}</span>
    </div>
    <div style="width: 100px;height: 100px;background-color: black;">

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: '',
      emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉'],
    };
  },
  methods: {
    addEmoji(emoji) {
      this.message += emoji;
    },
  },
};
</script>

<style scoped>
.emoji-input {
  position: relative;
}

.emoji-panel {
  width: 100px;
  height: 100px;
  position: absolute;
  bottom: 100%;
  left: 0;
  background-color: black;
  border: 1px solid #ccc;
}

.emoji-input:focus-within .emoji-panel {
  display: block;
}

.emoji-panel span {
  cursor: pointer;
  margin: 5px;
}
</style>

 -->


 <template>
  <el-button text @click="dialogTableVisible = true">
    open a Table nested Dialog
  </el-button>

  <el-dialog v-model="dialogTableVisible" title="Shipping address">
    <el-table :data="gridData">
      <el-table-column property="date" label="Date" width="150" />
      <el-table-column property="name" label="Name" width="200" />
      <el-table-column property="address" label="Address" />
    </el-table>
  </el-dialog>

  <!-- Form -->
  <el-button text @click="dialogFormVisible = true">
    open a Form nested Dialog
  </el-button>

  <el-dialog v-model="dialogFormVisible" title="Shipping address">
    <el-form :model="form">
      <el-form-item label="Promotion name" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Zones" :label-width="formLabelWidth">
        <el-select v-model="form.region" placeholder="Please select a zone">
          <el-option label="Zone No.1" value="shanghai" />
          <el-option label="Zone No.2" value="beijing" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'

const dialogTableVisible = ref(false)
const dialogFormVisible = ref(false)
const formLabelWidth = '140px'

const form = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
})

const gridData = [
  {
    date: '2016-05-02',
    name: 'John Smith',
    address: 'No.1518,  Jinshajiang Road, Putuo District',
  },
  {
    date: '2016-05-04',
    name: 'John Smith',
    address: 'No.1518,  Jinshajiang Road, Putuo District',
  },
  {
    date: '2016-05-01',
    name: 'John Smith',
    address: 'No.1518,  Jinshajiang Road, Putuo District',
  },
  {
    date: '2016-05-03',
    name: 'John Smith',
    address: 'No.1518,  Jinshajiang Road, Putuo District',
  },
]
</script>
<style scoped>
.el-button--text {
  margin-right: 15px;
}
.el-select {
  width: 300px;
}
.el-input {
  width: 300px;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>

