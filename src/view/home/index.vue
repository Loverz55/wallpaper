<template>
  <!-- vue3页面 -->
  <div class="container"> 
      <h1>Pinia 状态管理</h1>
      <el-button type="primary" @click="store.increment">+1</el-button>
      {{ store.count }}

      {{ store.doubleCount }}
  </div>
</template>

<script lang='ts' setup>
import { reactive ,ref, computed, watch, watchEffect} from 'vue'
import { useCounterStore } from '@/store/counter'
const store = useCounterStore()


</script>

<style scoped lang="scss">
.container{
  width: 100%;
  height: 100%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>