export default class Utils {
    public static getTimeString(timeStampMs: number = Date.now(), is24Hour: boolean = true): string {
        if (timeStampMs < 0) {
            return '00:00:00';
        }

        const date = new Date(timeStampMs);
        const minute = ('0' + date.getMinutes()).slice(-2);
        const second = ('0' + date.getSeconds()).slice(-2);

        if (is24Hour) {
            const hour = ('0' + date.getHours()).slice(-2);
            return `${hour}:${minute}:${second}`;
        } else {
            let hour12 = ('0' + date.getHours() % 12).slice(-2);
            const amPm = date.getHours() < 12 ? 'AM' : 'PM';
            if (amPm == 'PM' && hour12 == '00') {
                // 如果是下午 12点, 则显示为12点, 而不是00点
                hour12 = '12';
            }
            return `${hour12}:${minute}:${second} ${amPm}`;
        }
    }

    public static getDurationString(durationMs: number): string {
        const duration = new Date(durationMs);
        const hours = duration.getUTCHours().toString().padStart(2, '0');
        const minutes = duration.getUTCMinutes().toString().padStart(2, '0');
        const seconds = duration.getUTCSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }
}