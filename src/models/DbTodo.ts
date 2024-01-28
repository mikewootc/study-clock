import Dexie, { Table, liveQuery, Observable } from 'dexie';
import dayjs from 'dayjs'
import Logger from 'cpclog';

import TodoItemData, {TodoItemInterface} from '@/models/TodoItemData';

const logger = Logger.createWrapper('DbTodo', Logger.LEVEL_DEBUG);


export class TodoDexie extends Dexie {
  // We just tell the typing system this is the case
  //todos!: Table<TodoItemData>; 
  todos!: Table<TodoItemInterface>; 

  constructor() {
    logger.debug('TodoDexie. constructor');
    super('TodoDexie');
    this.version(1).stores({
      todos: '++id, description, todoStatus, todoPriority, dueDate, userId, createdTsMs, updatedTsMs, isLocalCached'
      //todos: '++id, description, todoStatus, todoPriority, dueDate'
    });
  }

  async newTodo(item?: TodoItemData): Promise<void> {
    logger.debug(`newTodo_. item: ${JSON.stringify(item)}`);
    let todo = new TodoItemData(item);
    logger.debug(`newTodo_. todo: ${JSON.stringify(todo)}`);
    logger.debug('newTodo_. this: ', this);
    await this.todos.add(todo);
  }

  get queryToday(): Observable<TodoItemData[]> {
    logger.debug(`queryToday_. enter.`);
    let today = dayjs().format('YYYY-MM-DD');
    return liveQuery(() => this.todos.where({dueDate: today}).toArray());
  }

  async clearToday() {
    logger.debug(`clearToday_. enter.`);
    try {
      const todayStartTsMs = new Date().setHours(0, 0, 0, 0);
      logger.debug(`clearToday_. todayStartTsMs: `, todayStartTsMs);
      await this.todos.where('startTsMs').above(todayStartTsMs).delete();
    } catch(error) {
        logger.error('clearToday_. error:', error);
        throw error;
    }
  }
}

export const dbTodo = new TodoDexie();