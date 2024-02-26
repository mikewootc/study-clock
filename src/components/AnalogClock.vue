<script setup lang="ts">
import { ref, onMounted, onUnmounted, Ref, provide } from 'vue';
import Logger from 'cpclog';
import dayjs from 'dayjs';
import Utils from '@/utils/Utils';

import VChart, { THEME_KEY } from 'vue-echarts';
import "echarts";

const props = defineProps<{
  isManualMode: boolean
  showDigitalClock: boolean
}>()
const emit = defineEmits(['onClickBack'])

const logger = Logger.createWrapper('Analog', Logger.LEVEL_DEBUG);

// 取今天的零点
const timestampMs = ref(dayjs().startOf('day').valueOf());
const option = ref({
  grid: {
      left: '0%', //默认10%
      right: '0%', //默认10%
      bottom: '0%', //默认60
      containLabel: true //grid区域是否包含坐标轴的刻度标签
  },
  graphic: [
    {
      type: 'text',
      left: 'center', // 横向位置居中
      top: '35%',     // 纵向位置偏上，根据需求调整
      style: {
        text: '',
        fontSize: 30,
        fill: '#333'
      }
    }
  ],
  series: [
    {
      name: 'hour',
      type: 'gauge',
      startAngle: 90,
      endAngle: -270,
      min: 0,
      max: 12,
      splitNumber: 12,
      clockwise: true,
      // Outline border
      axisLine: {
        lineStyle: {
          width: 5,
          color: [[1, 'rgba(0,0,0,0.7)']],
          shadowColor: 'rgba(0, 0, 0, 0.5)',
          shadowBlur: 15
        }
      },
      // Hour tick line
      splitLine: {
        distance: 20,
        lineStyle: {
          shadowColor: 'rgba(0, 0, 0, 0.3)',
          shadowBlur: 3,
          shadowOffsetX: 1,
          shadowOffsetY: 2
        }
      },
      // Minute tick line
      axisTick: {
        distance: 20,
        lineStyle: {
          shadowColor: 'rgba(0, 0, 0, 0.3)',
        },
      },
      // Hour number
      axisLabel: {
        fontSize: 25,
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
      pointer: {
        icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
        width: 12,
        length: '55%',
        offsetCenter: [0, '8%'],
        itemStyle: {
          color: '#C0911F',
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
          value: 0
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
      startAngle: 90,
      endAngle: -270,
      min: 0,
      max: 60,
      splitNumber: 12,
      clockwise: true,
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
      pointer: {
        icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
        width: 8,
        length: '70%',
        offsetCenter: [0, '8%'],
        itemStyle: {
          color: '#C0911F',
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
          borderColor: '#C0911F',
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
          value: 0
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
          color: '#C0911F',
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
          color: '#C0911F',
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
          value: 0
        }
      ]
    }
  ],
});

onMounted(() => {
  setInterval(function () {
    //logger.debug('setInterval_. enter.');
    //option.value.animationDurationUpdate = 300;
    if (!props.isManualMode) {
      //timestampMs.value = Date.now();
      let date = new Date();
      let second = date.getSeconds();
      let minute = date.getMinutes() + second / 60;
      let hour = (date.getHours() % 12) + minute / 60;
      // logger.debug('setInterval_. setAnalogClockTime.');
      setAnalogClockTime(hour, minute, second);
    }
  }, 1000);
});

onUnmounted(() => {
});

function setAnalogClockTime(hour: number, minute: number, second: number) {
  // logger.debug('setAnalogClockTime_. enter.');
  if (props.showDigitalClock) {
    option.value.graphic = [
      {
        type: 'text',
        left: 'center', // 横向位置居中
        top: '35%',     // 纵向位置偏上，根据需求调整
        style: {
          text: '' + Math.floor(hour).toString().padStart(2, '0') + ':' + Math.floor(minute).toString().padStart(2, '0') + ':' + Math.floor(second).toString().padStart(2, '0'),
          fontSize: 26,
          fill: '#333'
        }
      }
    ];
  }
  option.value.series = [
    {
      name: 'hour',
      animation: false,
      data: [{ value: hour }]
    },
    {
      name: 'minute',
      animation: false,
      data: [{ value: minute }]
    },
    {
      animation: false,
      name: 'second',
      data: [{ value: second }]
    }
  ];
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
  <div class="container" style="min-width: 400px; min-height: 400px;">
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
