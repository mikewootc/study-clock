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

    /**
     * 在一个字符串中解析以#开头的标签
     * @param {string} str 字符串
     * @return {string[]} 返回由标签与非标签字符串组成的数组
     *
     * @static
     * @memberof Utils
     */
    public static parseTag(str: string) {
        let result: string[] = [];
        let reg = /#([^#]+[\s$])/;
        do {
            let match = str.match(reg);
            if (match && match.index) {
                // 如果匹配到, 并且不是第一个字符, 则将匹配结果的index之前的子串(非tag), 和匹配结果, 依次添加到结果数组中
                if (match.index > 0) {
                    result.push(str.substring(0, match.index));
                    result.push(match[0]);
                } else {
                    result.push(match[0]);
                }
                str = str.substring(match.index + match[0].length);
            } else {
                result.push(str);
                break;
            }
        } while (str.length > 0);
        return result;
    }
}
