<script setup lang="ts">
import { ref, onMounted, onUnmounted, Ref } from 'vue';
import Assets from '@/assets';
import { PomodoroClock } from '@/models/PomodoroClock';
import { PomodoroHistoryItem, dbPomodoroClock } from '@/models/DbPomodoroClock';
import Utils from '@/utils/Utils';
import Logger from 'cpclog';
import { useObservable } from '@vueuse/rxjs';
import { Subscription } from 'rxjs';

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
const pomodoroHistory:Ref<PomodoroHistoryItem[]> = useObservable(
  //dbPomodoroClock.historyQuery
  dbPomodoroClock.historyQueryToday
);
let pomodoroHistorySubscription:Subscription|null = null;
const pomodoroCnt = ref(0);
const pomodoroTotalTimeMs = ref(0);

const soundSuccess = Assets.sounds.success;
const soundFail = Assets.sounds.fail;
logger.debug('soundSuccess:', soundSuccess);
const soundSuccessRef = ref<HTMLAudioElement>();
const soundFailRef = ref<HTMLAudioElement>();

onMounted(() => {
  logger.debug('onMounted_. workMode:', workMode.value, dbPomodoroClock.historyQueryToday);
  pomodoroHistorySubscription = dbPomodoroClock.historyQueryToday.subscribe((history:PomodoroHistoryItem[]) => {
    if (history) {
      logger.debug('historyQueryToday got subscription. history:', history);
      pomodoroCnt.value = history.length;
      pomodoroTotalTimeMs.value = history.reduce((acc, cur) => acc + cur.durationMs, 0);
    }
  });
});

onUnmounted(() => {
  if (pomodoroHistorySubscription) {
    pomodoroHistorySubscription.unsubscribe();
  }
});


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
  logger.debug('clearPomodoroCnt_ enter.');
  dbPomodoroClock.clearToday();
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
      if (pomodoroClock) {
        dbPomodoroClock.addPomodoroHistoryItem({startTsMs: pomodoroClock.startTsMs, durationMs: pomodoroClock.durationMs});
      }
      soundSuccessRef.value?.play();
    }
  }
}, 100);

</script>

<template>
  <div class="container">
    <div class="main-content">
      <div class="clock-area">
        <!-- 根据工作模式显示不同的内容 -->
        <div v-if="workMode === WorkMode.Normal">
          <!-- 显示当前数字时钟, 格式为: HH:MM:SS -->
          <!-- <p style="width: 800px; font-size: 100px; color: #333">{{ currTimeShow24h }} ^_^</p> -->
          <p class="text-clock-time">{{ currTimeShow12h }}</p>
          <el-button type="primary" @click="startPomodoro">开始专注</el-button>
          <el-button type="primary" @click="clearPomodoroCnt">清零</el-button>
        </div>
        <div v-else>
          <!-- 显示番茄时钟, 格式为: 25:00:00 -->
          <p class="text-clock-time">{{ getPomodoroRemainingTimeShow() }} ^_^</p>
          <el-button type="primary" @click="stopPomodoro">放弃专注</el-button>
        </div>
      </div>

      <ul class="history-area">
        <p class="text-pomodoro-cnt">
          番茄钟数: {{ pomodoroCnt }}
        </p>
        <p class="text-pomodoro-cnt">
          总时长 {{ Utils.getDurationString(pomodoroTotalTimeMs) }}
        </p>
        <li v-for="item in pomodoroHistory" :key="item.id">
          <p style=" margin: 0; padding: 0">
            开始时间: {{ Utils.getTimeString(item.startTsMs) }}, 
            时长: {{ Math.floor(item.durationMs / 1000 / 60) }} 分钟
          </p>
        </li>
      </ul>
    </div>
  </div>

  <audio ref="soundSuccessRef" :src="soundSuccess" :controls="false" :autoplay="false"></audio>
  <audio ref="soundFailRef" :src="soundFail" :controls="false" :autoplay="false"></audio>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  /* background-color: #f0f; */
}


.main-content {
  width: 100%;
  height: 100%;
  /* background-color: #0ff; */
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;;
}
/* 当窗口宽度小于等于 600px 时 */  
@media screen and (max-width: 600px) {
    .main-content {
        flex-direction: column;
    }
}

.clock-area {
  width: 400px;
  /* background-color: #ff0; */
}

.history-area {
  width: 400px;
  /* background-color: #404; */
  height: 200px;
  overflow-y: scroll;
  overflow-x: auto;
  scrollbar-width: 3px;
}
.history-area::-webkit-scrollbar {
    width: 4px;
}
.history-area::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(0,0,0,0.2);
}
.history-area::-webkit-scrollbar-track {
    border-radius: 0;
    background: rgba(0,0,0,0.1);
}



.read-the-docs {
  color: #888;
}
.text-clock-time {
  font-size: 3em;
}
.text-pomodoro-cnt {
  margin: 5px;
  font-size: 1.5em;
}

</style>
