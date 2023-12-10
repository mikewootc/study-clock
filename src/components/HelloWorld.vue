<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()

const currTimeShow24h = ref(getCur24hTime())
const currTimeShow12h = ref(getCur12hTime())

// 返回当前时间, 格式为: HH:MM:SS
function getCur24hTime() {
  const date = new Date();
  const hour = ('0' + date.getHours()).slice(-2);
  const minute = ('0' + date.getMinutes()).slice(-2);
  const second = ('0' + date.getSeconds()).slice(-2);
  return `${hour}:${minute}:${second}`;
}

// 返回当前时间, 格式为: 上午/下午/晚上 HH:MM:SS
function getCur12hTime() {
  const date = new Date();
  const hour12 = ('0' + date.getHours() % 12).slice(-2);
  const minute = ('0' + date.getMinutes()).slice(-2);
  const second = ('0' + date.getSeconds()).slice(-2);
  const amPm = date.getHours() < 12? 'AM' : 'PM';
  return `${hour12}:${minute}:${second} ${amPm}`;
}

// 设置定时器, 每100ms更新当前时间
setInterval(() => {
  currTimeShow24h.value = getCur24hTime()
}, 100);
</script>

<template>
  <!-- 显示当前数字时钟, 格式为: HH:MM:SS -->
  <p style="width: 800px; background-color: #468; font-size: 100px; color: #333">{{ currTimeShow24h }} ^_^</p>
  <p style="width: 800px; background-color: #468; font-size: 100px; color: #333">{{ currTimeShow12h }}</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
