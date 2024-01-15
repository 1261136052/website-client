<template>
    <div class="dialog-bg">
        <div class="dialog">
            <!-- <div>{{message}}</div> -->
            <div>
                <slot :title="title"  name="title">
                    {{title}}
                </slot>
            </div>
            <div>
                <slot></slot>
            </div>
            <div>{{weather}}</div>
            <div><input type="text" v-model="weather"></div>
            <!-- <div><input type="text" v-model="modelValue" @keydown.enter="submit" @keydown.esc="cancel"></div> -->
            <div class="btu-group">
                <!-- <button @click="submit">确定</button>
            <button @click="cannel">取消</button> -->
                <button @click="right()">确定</button>
                <button @click="close()">取消</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref,reactive,defineEmits, watch ,computed} from 'vue'

const c = computed(()=>{
    return "ccccs"
})

const props = defineProps({
        title: {
            type: String,
            default: "默认"
        }
        ,
        weather: {
            type: String,
            default: ""
        }
})
const emit = defineEmits(["close","update:weather"])
function close(){
   emit('close',66666)
}
const weather = ref(props.weather)
watch(weather,(v1)=>{
    props.weather = v1
    // console.log(v1)
})


function right(){
    console.log(props.weather);
    emit('update:weather',weather)
    close()
}
</script>

<style scoped>
.dialog-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    text-align: center;
}

.dialog {
    width: 300px;
    padding: 20px;
    margin: 0 auto;
    margin-top: 200px;
    background-color: antiquewhite;
}

.btu-group {
    margin-top: 50px;
    display: flex;
    justify-content: space-around;
}
</style>