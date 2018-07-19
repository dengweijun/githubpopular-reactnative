import {
    AsyncStorage
} from 'react-native';

export const FLAG_FAVORITE_PREFIX = 'favorite_';
export default class FavoriteDao {

    constructor(flag) {
        this.flag = flag;
        this.favoriteKey = FLAG_FAVORITE_PREFIX + flag;
    }

    /**
     * 添加收藏
     * @param key
     * @param value
     * @param callBack
     */
    saveFavoriteItem(key, value, callBack) {
        AsyncStorage.setItem(key, value, (error => {
            if (!error) {
                this.updateFavoriteKeys(key, true);
            }
        }))
    }

    /**
     * 取消收藏
     * @param key
     * @param callBack
     */
    removeFavoriteItem(key, callBack) {
        AsyncStorage.removeItem(key, (error => {
            if (!error) {
                this.updateFavoriteKeys(key, false);
            }
        }))
    }

    /**
     * 更新Key集合
     * @param key
     * @param isAdd：true收藏，false取消收藏
     */
    updateFavoriteKeys(key, isAdd) {
        AsyncStorage.getItem(this.favoriteKey, (error, result) => {
            if (!error) {
                let favoriteKeys = [];
                if (result) {// result不为空
                    favoriteKeys = JSON.parse(result);
                }
                let index = favoriteKeys.indexOf(key);
                if (isAdd) {// 添加收藏，则添加key
                    if (index === -1) {
                        favoriteKeys.push(key);
                    }
                } else {// 取消收藏，则移除key
                    if (index !== -1) {
                        favoriteKeys.splice(index, 1);
                    }
                }
                AsyncStorage.setItem(this.favoriteKey, JSON.stringify(favoriteKeys));
            }
        })

    }

    /**
     * 获取所有收藏的key
     * @returns {Promise}
     */
    getFavoriteKeys() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(this.favoriteKey, (error, result) => {
                if (!error) {
                    try {
                        if (result) {
                            resolve(JSON.parse(result));
                        } else {
                            reject(new Error("Keys is null"));
                        }
                    } catch (e) {
                        reject(e);
                    }
                } else {
                    reject(error);
                }
            })
        })
    }

    /**
     * 获取所有收藏的项目
     */
    getAllItems() {
        return new Promise((resolve, reject) => {
            this.getFavoriteKeys().then(keys => {
                let items = [];
                if (keys) {
                    AsyncStorage.multiGet(keys, (error, result) => {
                        if (!error) {
                            try {
                                // 遍历获取的json字符串数组
                                result.map((result, i, arr) => {
                                    // arr[i]表示第i段json字符串，arr[i][0]则表示这个json字符串的key,arr[i][0]表示value
                                    let key = arr[i][0];
                                    let value = arr[i][1];
                                    if (value) items.push(JSON.parse(value));
                                })
                                resolve(items);
                            } catch (e) {
                                reject(e);
                            }
                        } else {
                            resolve(items);
                        }
                    })
                }
            }).catch(e => {
                reject(e);
            })

        })
    }


}