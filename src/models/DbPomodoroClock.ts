import Dexie, { Table } from 'dexie';
import Logger from 'cpclog';
  import { liveQuery } from "dexie";

const logger = Logger.createWrapper('tag', Logger.LEVEL_DEBUG);

export interface PomodoroHistoryItem {
  id?: number;
  startTsMs: number;
  durationMs: number;
}

export class PomodoroClockDexie extends Dexie {
  // We just tell the typing system this is the case
  pomodoroHistory!: Table<PomodoroHistoryItem>; 

  constructor() {
    super('PomodoroClock');
    this.version(1).stores({
      pomodoroHistory: '++id, startTsMs, durationMs'
    });
  }

  async addPomodoroHistoryItem(item: PomodoroHistoryItem): Promise<void> {
    logger.debug(`addPomodoroHistoryItem_. item: ${JSON.stringify(item)}`);
    await this.pomodoroHistory.add(item);
  }

  get historyQueryToday(): Dexie.LiveQuery<PomodoroHistoryItem[]> {
    logger.debug(`getHistoryToday_`);
    const todayStartTsMs = new Date().setHours(0, 0, 0, 0);
    logger.debug('getHistoryToday_. todayStartTsMs: ', todayStartTsMs);
    return liveQuery(() => this.pomodoroHistory.where('startTsMs').above(todayStartTsMs).toArray());
  }

  get historyQuery(): Dexie.LiveQuery<PomodoroHistoryItem[]> {
    logger.debug(`historyQuery_. enter.`);
    return liveQuery(() => this.pomodoroHistory.toArray());
  }
}

export const dbPomodoroClock = new PomodoroClockDexie();