<script setup lang="ts">
import { ref, onMounted, onUnmounted, Ref, provide } from 'vue';
import Logger from 'cpclog';
// import { useObservable } from '@vueuse/rxjs';

// import Assets from '@/assets';
import Utils from '@/utils/Utils';
// import { Subscription } from 'rxjs';
import AnalogClock from '@/components/AnalogClock.vue';
import NoSleep from 'nosleep.js';

const logger = Logger.createWrapper('tag', Logger.LEVEL_DEBUG);

defineProps<{ msg: string }>()

// 定义工作模式枚举: 正常时钟与番茄时钟
enum WorkMode {
  Normal = 0,
  Manual = 1,
};

const noSleep = new NoSleep();
const currTimeShow24h = ref(getCur24hTime());
const currTimeShow12h = ref(getCur12hTime());
const workMode = ref(WorkMode.Normal);
const darkMode = ref(false);

onMounted(() => {
});

onUnmounted(() => {
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

function toggleDarkMode() {
  darkMode.value = !darkMode.value;
}

function onClickStayAwake() {
  logger.debug('onClickStayAwake_ enter.', noSleep.enable);
  noSleep.enable();
}

// 设置定时器, 每100ms更新当前时间
setInterval(() => {
  currTimeShow24h.value = getCur24hTime();
  currTimeShow12h.value = getCur12hTime();
}, 100);

</script>

<template>
  <div class="container">
    <div class="main-content">
      <div class="clock-area">
        <AnalogClock style="width: 100%; height: 100%"
          :isManualMode="workMode === WorkMode.Manual"
          :showDigitalClock="workMode === WorkMode.Manual"
          @onClickBack="workMode = WorkMode.Normal"
          :darkMode="darkMode"
        />
      </div>

      <el-button type="primary" style="position: absolute; bottom: 5px; right: 5px;" @click="onClickStayAwake">常亮</el-button>
      <el-button type="primary" style="position: absolute; top: 5px; right: 5px;" @click="toggleDarkMode">{{darkMode ? 'Light' : 'Dark'}}</el-button>
    </div>
  </div>
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
  width: 100%;
  height: 100%;
  /* background-color: #ff0; */

  /* 纵向排列, 居中 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
.chart {
  height: 100vh;
}
</style>
