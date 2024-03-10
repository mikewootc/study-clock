<script setup lang="ts">
import { ref, onMounted, onUnmounted, Ref, provide, computed, watch } from 'vue';
import Logger from 'cpclog';
import dayjs from 'dayjs';
import Utils from '@/utils/Utils';

import VChart, { THEME_KEY } from 'vue-echarts';
import "echarts";

const logger = Logger.createWrapper('Analog', Logger.LEVEL_DEBUG);

/** Types and Constants ===================================================== */
interface IAnalogClockTheme {
  backgroundColor: string;
  clockForegroundColor: string;
  clockShadowColor: string;
  clockPointerColor: string;
};

const AnalogClockThemes: {light: IAnalogClockTheme, dark: IAnalogClockTheme} = {
  light: {
    backgroundColor: '#F0F0F0',
    clockForegroundColor: 'rgba(0,0,0,0.7)',
    clockShadowColor: 'rgba(0, 0, 0, 0.3)',
    clockPointerColor: '#C0911F',
  },
  dark: {
    backgroundColor: '#080808',
    clockForegroundColor: '#87CBEB',
    clockShadowColor: 'rgba(135, 203, 235, 0.3)',
    clockPointerColor: '#87CBEB',
  }
}

/** Props =================================================================== */
const props = defineProps<{
  isManualMode: boolean,
  showDigitalClock: boolean,
  themeMode?: String,
}>()
const emit = defineEmits(['onClickBack'])

/** States ================================================================== */
let autoDark: Ref<boolean> = ref(false);
let colorTheme = computed(() => {
  let t = AnalogClockThemes.light;

  switch (props.themeMode) {
    case 'light':
      t = AnalogClockThemes.light;
      break;
  
    case 'dark':
      t = AnalogClockThemes.dark;
      break;
  
    default:
      t = autoDark.value ? AnalogClockThemes.dark : AnalogClockThemes.light;
      break;
  }

  console.log('colorTheme:', t, 'autoDark:', autoDark.value);
  return t;
})

// 取今天的零点
const timestampMs = ref(dayjs().startOf('day').valueOf());
const option = ref(getOption());
function getOption(hour: number = 0, minute: number = 0, second: number = 0) {
  let digitalClockText = ''
  if (props.showDigitalClock) {
    digitalClockText = '' + Math.floor(hour).toString().padStart(2, '0') + ':' + Math.floor(minute).toString().padStart(2, '0') + ':' + Math.floor(second).toString().padStart(2, '0');
  }

  return ({
    graphic: [
      {
        type: 'text',
        left: 'center', // 横向位置居中
        top: '35%',     // 纵向位置偏上，根据需求调整
        style: {
          text: digitalClockText,
          fontSize: 30,
          fill: '#333'
        }
      }
    ],
    series: [
      {
        name: 'hour',
        type: 'gauge',
        radius: '95%',
        startAngle: 90,
        endAngle: -270,
        min: 0,
        max: 12,
        splitNumber: 12,
        clockwise: true,
        animation: false,
        // Outline border
        axisLine: {
          lineStyle: {
            width: 5,
            // color: [[1, 'rgba(0,0,0,0.7)']],
            color: [[1, colorTheme.value.clockForegroundColor]],
            // shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowColor: colorTheme.value.clockShadowColor,
            shadowBlur: 15
          }
        },
        // Hour tick line
        splitLine: {
          distance: 20,
          lineStyle: {
            // shadowColor: 'rgba(0, 0, 0, 0.3)',
            color: colorTheme.value.clockForegroundColor,
            shadowColor: colorTheme.value.clockShadowColor,
            shadowBlur: 3,
            shadowOffsetX: 1,
            shadowOffsetY: 2
          }
        },
        // Minute tick line
        axisTick: {
          distance: 20,
          lineStyle: {
            color: colorTheme.value.clockForegroundColor,
            shadowColor: colorTheme.value.clockShadowColor,
          },
        },
        // Hour number
        axisLabel: {
          fontSize: 25,
          color: colorTheme.value.clockForegroundColor,
          distance: 10,
          formatter: function (value) {
            if (value === 0) {
              return '';
            }
            return value + '';
          }
        },
        //anchor: { // 'ECHARTS'
        //  show: true,
        //  icon: 'path://M532.8,70.8C532.8,70.8,532.8,70.8,532.8,70.8L532.8,70.8C532.7,70.8,532.8,70.8,532.8,70.8z M456.1,49.6c-2.2-6.2-8.1-10.6-15-10.6h-37.5v10.6h37.5l0,0c2.9,0,5.3,2.4,5.3,5.3c0,2.9-2.4,5.3-5.3,5.3v0h-22.5c-1.5,0.1-3,0.4-4.3,0.9c-4.5,1.6-8.1,5.2-9.7,9.8c-0.6,1.7-0.9,3.4-0.9,5.3v16h10.6v-16l0,0l0,0c0-2.7,2.1-5,4.7-5.3h10.3l10.4,21.2h11.8l-10.4-21.2h0c6.9,0,12.8-4.4,15-10.6c0.6-1.7,0.9-3.5,0.9-5.3C457,53,456.7,51.2,456.1,49.6z M388.9,92.1h11.3L381,39h-3.6h-11.3L346.8,92v0h11.3l3.9-10.7h7.3h7.7l3.9-10.6h-7.7h-7.3l7.7-21.2v0L388.9,92.1z M301,38.9h-10.6v53.1H301V70.8h28.4l3.7-10.6H301V38.9zM333.2,38.9v10.6v10.7v31.9h10.6V38.9H333.2z M249.5,81.4L249.5,81.4L249.5,81.4c-2.9,0-5.3-2.4-5.3-5.3h0V54.9h0l0,0c0-2.9,2.4-5.3,5.3-5.3l0,0l0,0h33.6l3.9-10.6h-37.5c-1.9,0-3.6,0.3-5.3,0.9c-4.5,1.6-8.1,5.2-9.7,9.7c-0.6,1.7-0.9,3.5-0.9,5.3l0,0v21.3c0,1.9,0.3,3.6,0.9,5.3c1.6,4.5,5.2,8.1,9.7,9.7c1.7,0.6,3.5,0.9,5.3,0.9h33.6l3.9-10.6H249.5z M176.8,38.9v10.6h49.6l3.9-10.6H176.8z M192.7,81.4L192.7,81.4L192.7,81.4c-2.9,0-5.3-2.4-5.3-5.3l0,0v-5.3h38.9l3.9-10.6h-53.4v10.6v5.3l0,0c0,1.9,0.3,3.6,0.9,5.3c1.6,4.5,5.2,8.1,9.7,9.7c1.7,0.6,3.4,0.9,5.3,0.9h23.4h10.2l3.9-10.6l0,0H192.7z M460.1,38.9v10.6h21.4v42.5h10.6V49.6h17.5l3.8-10.6H460.1z M541.6,68.2c-0.2,0.1-0.4,0.3-0.7,0.4C541.1,68.4,541.4,68.3,541.6,68.2L541.6,68.2z M554.3,60.2h-21.6v0l0,0c-2.9,0-5.3-2.4-5.3-5.3c0-2.9,2.4-5.3,5.3-5.3l0,0l0,0h33.6l3.8-10.6h-37.5l0,0c-6.9,0-12.8,4.4-15,10.6c-0.6,1.7-0.9,3.5-0.9,5.3c0,1.9,0.3,3.7,0.9,5.3c2.2,6.2,8.1,10.6,15,10.6h21.6l0,0c2.9,0,5.3,2.4,5.3,5.3c0,2.9-2.4,5.3-5.3,5.3l0,0h-37.5v10.6h37.5c6.9,0,12.8-4.4,15-10.6c0.6-1.7,0.9-3.5,0.9-5.3c0-1.9-0.3-3.7-0.9-5.3C567.2,64.6,561.3,60.2,554.3,60.2z',
        //  showAbove: false,
        //  offsetCenter: [0, '-35%'],
        //  size: 120,
        //  keepAspect: true,
        //  itemStyle: {
        //    color: '#707177'
        //  }
        //},

        // Hour pointer
        pointer: {
          icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
          width: 12,
          length: '55%',
          offsetCenter: [0, '8%'],
          itemStyle: {
            color: colorTheme.value.clockPointerColor,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
            shadowBlur: 8,
            shadowOffsetX: 2,
            shadowOffsetY: 4
          }
        },
        detail: {
          show: false
        },
        title: {
          offsetCenter: [0, '30%']
        },
        data: [
          {
            value: hour
          }
        ]
      },
      //{
      //  name: 'hour24number',
      //  type: 'gauge',
      //  startAngle: 90,
      //  endAngle: -270,
      //  min: 0,
      //  max: 12,
      //  splitNumber: 12,
      //  clockwise: true,
      //  // Outline border
      //  axisLine: {
      //    show: false,
      //  },
      //  // Hour tick line
      //  splitLine: {
      //    show: false,
      //  },
      //  // Minute tick line
      //  axisTick: {
      //    show: false,
      //  },
      //  // Hour number
      //  axisLabel: {
      //    show: false,
      //    fontSize: 15,
      //    distance: 50,
      //    color: 'gray',
      //    formatter: function (value) {
      //      if (value === 0) {
      //        return '';
      //      }
      //      return value + 12 + '';
      //    }
      //  },
      //},
      {
        name: 'minute',
        type: 'gauge',
        radius: '95%',
        startAngle: 90,
        endAngle: -270,
        min: 0,
        max: 60,
        splitNumber: 12,
        clockwise: true,
        animation: false,
        axisLine: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        // Minute number
        axisLabel: {
          show: true,
          interval: 5,
          distance: -12,
          showMaxLabel: false,
          color: 'gray',
          formatter: function (value) {
            if (value === 60) {
              return '';
            }
            return value + '';
          },
        },
        // Minute pointer
        pointer: {
          icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
          width: 8,
          length: '70%',
          offsetCenter: [0, '8%'],
          itemStyle: {
            // color: '#C0911F',
            color: colorTheme.value.clockPointerColor,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
            shadowBlur: 8,
            shadowOffsetX: 2,
            shadowOffsetY: 4
          }
        },
        anchor: {
          show: true,
          size: 20,
          showAbove: false,
          itemStyle: {
            borderWidth: 15,
            // borderColor: '#C0911F',
            borderColor: colorTheme.value.clockPointerColor,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
            shadowBlur: 8,
            shadowOffsetX: 2,
            shadowOffsetY: 4
          }
        },
        detail: {
          show: false
        },
        title: {
          offsetCenter: ['0%', '-40%']
        },
        data: [
          {
            value: minute
          }
        ]
      },
      {
        name: 'second',
        type: 'gauge',
        startAngle: 90,
        endAngle: -270,
        min: 0,
        max: 60,
        //animationEasingUpdate: 'bounceOut',
        clockwise: true,
        animation: false,
        axisLine: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false
        },
        pointer: {
          icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
          width: 4,
          length: '85%',
          offsetCenter: [0, '8%'],
          itemStyle: {
            // color: '#C0911F',
            color: colorTheme.value.clockPointerColor,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
            shadowBlur: 8,
            shadowOffsetX: 2,
            shadowOffsetY: 4
          }
        },
        anchor: {
          show: true,
          size: 15,
          showAbove: true,
          itemStyle: {
            // color: '#C0911F',
            color: colorTheme.value.clockPointerColor,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
            shadowBlur: 8,
            shadowOffsetX: 2,
            shadowOffsetY: 4
          }
        },
        detail: {
          show: false
        },
        title: {
          offsetCenter: ['0%', '-40%']
        },
        data: [
          {
            value: second
          }
        ]
      }
    ],
  });
}

function getCurrTimeSection(): [number, number, number] {
  let date = new Date();
  let second = date.getSeconds();
  let minute = date.getMinutes() + second / 60;
  let hour = (date.getHours() % 12) + minute / 60;

  return [hour, minute, second];
}

onMounted(() => {
  let time = getCurrTimeSection();
  setAnalogClockTime(...time);

  setInterval(function () {
    if (!props.isManualMode) {
      let time = getCurrTimeSection();

      //logger.debug('onMounted() callback_. autoDark:', autoDark.value);
      let d = new Date();
      let hour24 = d.getHours();
      if ((hour24>= 20 /*&& time[1] >= 31*/) || hour24 < 6)  {
        if (!autoDark.value) {
          logger.debug('onMounted() callback_. to dark');
          autoDark.value = true;
        }
      } else {
        if (autoDark.value) {
          logger.debug('onMounted() callback_. to light');
          autoDark.value = false;
        }
      }

      setAnalogClockTime(...time);
    }
  }, 1000);
});

onUnmounted(() => {
});

function setAnalogClockTime(hour: number, minute: number, second: number) {
  // logger.debug('setAnalogClockTime_. enter.');
  option.value = getOption(hour, minute, second);
  //if (props.showDigitalClock) {
  //  option.value.graphic = [
  //    {
  //      type: 'text',
  //      left: 'center', // 横向位置居中
  //      top: '35%',     // 纵向位置偏上，根据需求调整
  //      style: {
  //        text: '' + Math.floor(hour).toString().padStart(2, '0') + ':' + Math.floor(minute).toString().padStart(2, '0') + ':' + Math.floor(second).toString().padStart(2, '0'),
  //        fontSize: 26,
  //        fill: '#333'
  //      }
  //    }
  //  ];
  //}
  //option.value.series = [
  //  {
  //    name: 'hour',
  //    animation: false,
  //    data: [{ value: hour }]
  //  },
  //  {
  //    name: 'minute',
  //    animation: false,
  //    data: [{ value: minute }]
  //  },
  //  {
  //    animation: false,
  //    name: 'second',
  //    data: [{ value: second }]
  //  }
  //];
}

function onClickAddMinutes(minutes:number) {
  logger.debug('onClickAddMinutes_. enter.', minutes);
  timestampMs.value += minutes * 60 * 1000;
  //const hour = dayjs(timestampMs.value).hour();
  //const minute = dayjs(timestampMs.value).minute();
  //const second = dayjs(timestampMs.value).second();
  let date = new Date(timestampMs.value);
  let second = date.getSeconds();
  let minute = date.getMinutes() + second / 60;
  let hour = (date.getHours() % 12) + minute / 60;
  setAnalogClockTime(hour, minute, second);
}

function onClickBack() {
  // 将数字时钟设为空串
  option.value.graphic = [
    {
      type: 'text',
      left: 'center', // 横向位置居中
      top: '35%',     // 纵向位置偏上，根据需求调整
      style: {
        text: '',
        fontSize: 26,
        fill: '#333'
      }
    }
  ];

  emit('onClickBack');
}

</script>

<template>
  <div class="container" style="min-width: 360px; min-height: 360px;" :style="{backgroundColor: colorTheme.backgroundColor}">
    <v-chart class="chart" :option="option" autoresize />

    <el-button v-if="isManualMode" type="primary" @click="onClickAddMinutes(-60)">-60</el-button>
    <el-button v-if="isManualMode" type="primary" @click="onClickAddMinutes(-5)">-5</el-button>
    <el-button v-if="isManualMode" type="primary" @click="onClickAddMinutes(-1)">-1</el-button>

    <el-button v-if="isManualMode" type="primary" @click="onClickBack">返回</el-button>

    <el-button v-if="isManualMode" type="primary" @click="onClickAddMinutes(1)">+1</el-button>
    <el-button v-if="isManualMode" type="primary" @click="onClickAddMinutes(5)">+5</el-button>
    <el-button v-if="isManualMode" type="primary" @click="onClickAddMinutes(60)">+60</el-button>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  /* background-color: #f0f; */
}


</style>
