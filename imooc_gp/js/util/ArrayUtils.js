export default class ArrayUtils {
    /**
     * 更新数据，如果存在，则从数组中移除；否则添加到数组
     * @param array
     * @param item
     */
    static updateArray(array, item) {
        for (let i = 0; i < array.length; i++) {
            let temp = array[i];
            if (temp === item) {
                array.splice(i, 1);
                return;
            }
        }
        array.push(item);
    }

    /**
     * 克隆一个数组
     * @param from
     * @returns {*}
     */
    static clone(from) {
        let newArr = [];
        if (!from) return newArr;
        for (let i = 0; i < from.length; i++) {
            newArr[i] = from[i];
        }
        return newArr;
    }

    /**
     * 判断两个数组是否相等
     * @param arr1
     * @param arr2
     * @returns {boolean}
     */
    static isEqual(arr1, arr2) {
        if (!(arr1 && arr2)) return false;// 如果arr1和arr2有一个为空，则返回false
        if (arr1.length !== arr2.length) return false;// 如果arr1和arr2的长度不相等，则返回false
        for (let i = 0; i < arr2.length; i++) {
            if (arr1[i] !== arr2[i]) return false;// 只要有一个不相等，则返回false
        }
        return true;
    }

    /**
     * 从数组中移除指定的元素
     * @param arr
     * @param item
     */
    static remove(arr, item) {
        if (!arr) return arr;// 如果arr为空，则直接返回
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === item) {
                arr.splice(i, 1);
                return;
            }
        }
    }

}