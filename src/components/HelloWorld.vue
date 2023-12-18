<script setup lang="ts">
import { ref } from 'vue'
import Assets from '@/assets'
import { PomodoroClock } from '@/models/PomodoroClock';
import Utils from '@/utils/Utils';
import Logger from 'cpclog';

const logger = Logger.createWrapper('tag', Logger.LEVEL_DEBUG);

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
const pomodoroDurationSec = 15 * 60;
//const pomodoroStartTimeStampMs = ref(0);
const pomodoroRemainingTimeMs = ref(0);
let pomodoroClock:PomodoroClock|null = null;
const pomodoroCnt = ref(0);
const soundSuccess = Assets.sounds.success;
const soundFail = Assets.sounds.fail;
logger.debug('soundSuccess:', soundSuccess);
const soundSuccessRef = ref<HTMLAudioElement>();
const soundFailRef = ref<HTMLAudioElement>();


// 返回当前时间, 格式为: HH:MM:SS
function getCur24hTime() {
  try {
    return Utils.getTimeString(Date.now(), true);
  } catch(error) {
      logger.error('getCur24hTime_. error:', error);
      throw error;
  }
}

// 返回当前时间, 格式为: 上午/下午/晚上 HH:MM:SS
function getCur12hTime() {
  try {
    return Utils.getTimeString(Date.now(), false);
  } catch(error) {
      logger.error('getCur12hTime_. error:', error);
      throw error;
  }
}

function setWorkMode(mode: WorkMode) {
  workMode.value = mode;
}

// 开始番茄钟
function startPomodoro() {
  pomodoroClock = new PomodoroClock(Date.now(), pomodoroDurationSec * 1000);
  // 计算剩余时间
  pomodoroRemainingTimeMs.value = pomodoroClock.getRemainingTimeMs();
  setWorkMode(WorkMode.Pomodoro);
}

// 停止番茄钟
function stopPomodoro() {
  setWorkMode(WorkMode.Normal);
  soundFailRef.value?.play();
  //if (soundSuccessRef.value) {
  //  soundSuccessRef.value.pause();
  //  soundSuccessRef.value.currentTime = 0;
  //}
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
  
  if (workMode.value === WorkMode.Pomodoro) {
    pomodoroRemainingTimeMs.value = pomodoroClock ? pomodoroClock.getRemainingTimeMs() : 0;
    //logger.debug('pomodoroRemainingTimeMs:', pomodoroRemainingTimeMs.value);
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

  <audio ref="soundSuccessRef" :src="soundSuccess" :controls="false" :autoplay="false"></audio>
  <audio ref="soundFailRef" :src="soundFail" :controls="false" :autoplay="false"></audio>
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
