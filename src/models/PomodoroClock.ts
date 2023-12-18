export class PomodoroClock {
  private _startTsMs: number;
  private _durationMs: number;

  constructor(startTsMs: number = 0, durationMs: number = 25 * 60 * 1000) {
    this._startTsMs = startTsMs;
    this._durationMs = durationMs;
  }

  get startTsMs(): number {
    return this._startTsMs;
  }
  set startTsMs(value: number) {
    this._startTsMs = value;
  }

  get durationMs(): number {
    return this._durationMs;
  }
  set durationMs(value: number) {
    this._durationMs = value;
  }

  isTimeUp(): boolean {
    return this.startTsMs + this.durationMs < Date.now();
  }

  getRemainingTimeMs(): number {
    if (this.isTimeUp()) {
      return 0;
    } else {
      return this.startTsMs + this.durationMs - Date.now();
    }
  }
}