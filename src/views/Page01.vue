<template>
    <div>
        page01{{count}}
        {{testG }}
        <button @click="double2()">click</button>
    </div>
</template>

<script setup>
import { defineStore,storeToRefs } from "pinia";
import {testStore} from "../stores/TestStore"

const store = testStore()

let {count,testG} = storeToRefs(store)
function double2(){
    store.testA()
}
</script>

<style  scoped>

</style>
