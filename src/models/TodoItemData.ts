import dayjs from 'dayjs'

// 代办状态枚举
export enum TodoStatus {
    TODO = 'todo', /** 未完成 */
    DONE = 'done', /** 已完成 */
    CANCELLED = 'canceled', /** 已取消 */
}

// 代办优先级枚举
export enum TodoPriority {
    LOW = 0, /** 低 */
    NORMAL = 1, /** 中 */
    HIGH = 2, /** 高 */
}

export interface TodoItemInterface {
    description: string;
    todoStatus: TodoStatus;
    todoPriority: TodoPriority;
    dueDate?: string; // 形如: 2020-01-01
}

export default class TodoItemData implements TodoItemInterface {
    // 用户编辑属性
    description: string;
    todoStatus: TodoStatus;
    todoPriority: TodoPriority;
    dueDate?: string; // 形如: 2020-01-01

    // 系统属性
    id?: number;
    userId: number;
    createdTsMs: number;
    updatedTsMs: number;
    isLocalCached: boolean; // 是否为本地新建的暂存条目(即未提交服务器)

    constructor(item?: TodoItemInterface) {
        this.description = item?.description ?? '';
        this.todoStatus = item?.todoStatus ?? TodoStatus.TODO;
        this.todoPriority = item?.todoPriority ?? TodoPriority.NORMAL;
        this.dueDate = item?.dueDate ?? dayjs().format('YYYY-MM-DD');

        this.userId = 0;
        this.createdTsMs = Date.now();
        this.updatedTsMs = Date.now();
        this.isLocalCached = true;
    }
}