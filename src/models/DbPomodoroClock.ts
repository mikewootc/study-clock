import Dexie, { Table, liveQuery, Observable } from 'dexie';
import Logger from 'cpclog';

const logger = Logger.createWrapper('DbPomodoroClock', Logger.LEVEL_DEBUG);

export interface PomodoroHistoryItem {
  id?: number;
  startTsMs: number;
  durationMs: number;
}

export class PomodoroClockDexie extends Dexie {
  // We just tell the typing system this is the case
  pomodoroHistory!: Table<PomodoroHistoryItem>; 

  constructor() {
    logger.debug('PomodoroClockDexie. constructor');
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
    logger.debug(`getHistoryToday_. enter.`);
    const todayStartTsMs = new Date().setHours(0, 0, 0, 0);
    logger.debug('getHistoryToday_. todayStartTsMs: ', todayStartTsMs);
    return liveQuery(() => this.pomodoroHistory.where('startTsMs').above(todayStartTsMs).toArray());
  }

  async clearToday() {
    logger.debug(`clearToday_. enter.`);
    try {
      const todayStartTsMs = new Date().setHours(0, 0, 0, 0);
      logger.debug(`clearToday_. todayStartTsMs: `, todayStartTsMs);
      await this.pomodoroHistory.where('startTsMs').above(todayStartTsMs).delete();
    } catch(error) {
        logger.error('clearToday_. error:', error);
        throw error;
    }
  }

  get historyQuery(): Observable<PomodoroHistoryItem[]> {
    logger.debug(`historyQuery_. enter.`);
    return liveQuery(() => this.pomodoroHistory.toArray());
  }
}

export const dbPomodoroClock = new PomodoroClockDexie();