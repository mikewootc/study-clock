<script setup lang="ts">
import { ref } from 'vue'
import Assets from '@/assets'

defineProps<{ msg: string }>()

// 定义工作模式枚举: 正常时钟与番茄时钟
enum WorkMode {
  Normal = 0,
  Pomodoro = 1
};

const currTimeShow24h = ref(getCur24hTime());
const currTimeShow12h = ref(getCur12hTime());
const workMode = ref(WorkMode.Normal);
// 每个番茄钟时长
const pomodoroDurationMinutes = 15;
const pomodoroStartTimeStampMs = ref(0);
const pomodoroRemainingTimeMs = ref(0);
const pomodoroCnt = ref(0);
const soundSuccess = ref(Assets.sounds.success);
console.log(soundSuccess.value);
const soundSuccessRef = ref<HTMLAudioElement>();


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
  const amPm = date.getHours() < 12 ? 'AM' : 'PM';
  return `${hour12}:${minute}:${second} ${amPm}`;
}

function setWorkMode(mode: WorkMode) {
  workMode.value = mode;
}

// 开始番茄钟
function startPomodoro() {
  pomodoroStartTimeStampMs.value = Date.now();
  setWorkMode(WorkMode.Pomodoro);
  // 计算剩余时间
  calcPomodoroRemainingTimeMs();
}

// 停止番茄钟
function stopPomodoro() {
  setWorkMode(WorkMode.Normal);
  //if (soundSuccessRef.value) {
  //  soundSuccessRef.value.pause();
  //  soundSuccessRef.value.currentTime = 0;
  //}
}

// 计算番茄钟剩余时长
function calcPomodoroRemainingTimeMs() {
  const currTimeMs = Date.now();
  const remainingTimeMs = pomodoroStartTimeStampMs.value + pomodoroDurationMinutes * 60 * 1000 - currTimeMs;
  console.log('calc remainingTimeMs:', remainingTimeMs);
  pomodoroRemainingTimeMs.value = remainingTimeMs;
}

// 获取番茄钟剩余时间, 格式为: MM:SS
function getPomodoroRemainingTimeShow() {
  if (workMode.value === WorkMode.Pomodoro) {
    const remainingTimeMs = pomodoroRemainingTimeMs.value;
    //console.log('remainingTimeMs:', remainingTimeMs);
    const remainingTimeAllSeconds = Math.floor(remainingTimeMs / 1000);
    const remainingTimeMinutes = Math.floor(remainingTimeAllSeconds / 60);
    const remainingTimeSeconds = remainingTimeAllSeconds % 60;
    return `${('0' + remainingTimeMinutes).slice(-2)}:${('0' + remainingTimeSeconds).slice(-2)}`;
  } else {
    return '';
  }
}

function clearPomodoroCnt() {
  pomodoroCnt.value = 0;
}

// 设置定时器, 每100ms更新当前时间
setInterval(() => {
  currTimeShow24h.value = getCur24hTime();
  currTimeShow12h.value = getCur12hTime();
  //console.log('workMode.value', workMode.value);
  
  if (workMode.value === WorkMode.Pomodoro) {
    calcPomodoroRemainingTimeMs();
    if (pomodoroRemainingTimeMs.value <= 0) {
      // 番茄钟时间到
      setWorkMode(WorkMode.Normal);
      pomodoroCnt.value++;
      soundSuccessRef.value?.play();
    }
  }
}, 100);
</script>

<template>
  <!-- 根据工作模式显示不同的内容 -->
  <div v-if="workMode === WorkMode.Normal">
    <!-- 显示当前数字时钟, 格式为: HH:MM:SS -->
    <!-- <p style="width: 800px; font-size: 100px; color: #333">{{ currTimeShow24h }} ^_^</p> -->
    <p class="text-clock-time">{{ currTimeShow12h }}</p>
    <p class="text-pomodoro-cnt">
      番茄钟: {{ pomodoroCnt }}
    </p>
    <el-button type="primary" @click="startPomodoro">开始专注</el-button>
    <el-button type="primary" @click="clearPomodoroCnt">清零</el-button>
  </div>
  <div v-else>
    <!-- 显示番茄时钟, 格式为: 25:00:00 -->
    <p class="text-clock-time">{{getPomodoroRemainingTimeShow()}} ^_^</p>
    <el-button type="primary" @click="stopPomodoro">放弃专注</el-button>
  </div>

  <audio ref="soundSuccessRef" :src="soundSuccess" :controls="false" autoplay="false"></audio>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
.text-clock-time {
  font-size: 3em;
}
.text-pomodoro-cnt {
  font-size: 1.5em;
}
</style>
