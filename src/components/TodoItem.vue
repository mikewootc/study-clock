<script setup lang="ts">
/**
 * @description 代办事项条目组件
 * @export
 * @class TodoItem
 * @extends {Vue}
 * 
 */
import {TodoStatus} from '@/models/TodoItemData';
import { onMounted } from 'vue';
import Logger from 'cpclog';

const logger = Logger.createWrapper('tag', Logger.LEVEL_DEBUG);

//defineProps({
//    todoStatus: TodoStatus,
//})
const props = defineProps(['todoStatus', 'description']);

onMounted(() => {
  logger.debug('TodoItem onMounted', props.todoStatus);
})
</script>

<template>
  <div :class="{'todo-item': true, 'color-done': todoStatus === TodoStatus.DONE, 'color-todo': todoStatus === TodoStatus.TODO}">
    <!-- <input class="todo-item-checkbox" type="checkbox" :checked="todoStatus == TodoStatus.DONE" /> -->
    <p v-if="todoStatus === TodoStatus.DONE" class="todo-item-checkbox color-done">√</p>
    <p v-else class="todo-item-checkbox color-todo">{{' '}}</p>
    <span class="todo-item-description">{{ description }}</span>
  </div>
</template>

<style scoped>
.todo-item {
  cursor: pointer;
  padding: 10px 20px;
  border-bottom: 1px solid #ccc;

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.todo-item-checkbox {
    margin-right: 5px;
    width: 1.0em;
    height: 1.0em;
    line-height: 1.0em;
    border: 2px solid #888;
    border-radius: 3px;
    display: inline-block;
}

.todo-item-content-todo {
  color: #333;
  /* font-size: 16px; */
  cursor: pointer;
}

.todo-item-content-done {
  /* text-decoration: line-through; */
  /* font-size: 16px; */
}

.color-done {
  color: green;
  border-color: green;
}

.color-todo {
  color: #333;
}

.todo-item-description {
    /* color: red; */
}

</style>
