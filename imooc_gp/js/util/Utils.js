export default class Utils {
    /**
     * 校验项目是否收藏
     * @param item：项目
     * @param keys：key集合
     * @returns {boolean} true收藏，false未收藏
     */
    static checkFavoriteKey(item, keys) {
        // item.id若不为空，说明是Popular页面的数据；否则为Trending页面的数据
        let id = item.id ? item.id.toString() : item.fullName;
        for (let i = 0; i < keys.length; i++) {
            if (id === keys[i]) {
                return true;
            }
        }
        return false;
    }

    /***
     * 检测本地缓存数据是否过时
     * @param longTIme：数据时间戳
     * @return {boolean} true不需要更新，false需要更新
     */
    static checkDate(longTime) {
        let cDate = new Date();// 当前时间
        let tDate = new Date();// 缓存数据的时间
        tDate.setTime(longTime);
        if (cDate.getMonth() !== tDate.getMonth()) return false;
        if (cDate.getDay() !== tDate.getDay()) return false;
        if (cDate.getHours() - tDate.getHours() > 4) return false;// 大于4小时表示过时
        return true;
    }
}