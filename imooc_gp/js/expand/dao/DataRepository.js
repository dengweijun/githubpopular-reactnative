import React, {Component} from 'react';
import {
    AsyncStorage
} from 'react-native';

import GitHubTrending from 'GitHubTrending';

export var FLAG_STORAGE = {flag_popular: 'popular', flag_trending: 'trending', flag_my: 'my'};
export default class DataRepository {

    constructor(flag) {
        this.flag = flag;
        if (flag === FLAG_STORAGE.flag_trending) this.trending = new GitHubTrending();
    }

    /**
     * 获取数据
     * @param url
     * @returns {Promise}
     */
    fetchRepository(url) {
        return new Promise((resolve, reject) => {
            // 首先获取本地的数据
            this.fetchLocalRepository(url).then(result => {
                if (result) {// 如果本地数据不为空，则返回本地数据
                    resolve(result);
                } else {// 如果本地数据为空，则获取网络数据
                    this.fetchNetRepository(url).then(result => {
                        resolve(result);
                    }).catch(e => {
                        reject(e);
                    })
                }
            }).catch(e => {
                // 获取本地数据异常，则获取网络数据
                this.fetchNetRepository(url).then(result => {
                    resolve(result);
                }).catch(e => {
                    reject(e);
                })
            })
        })
    }

    /**
     * 获取本地缓存数据
     * @param url
     * @returns {Promise}
     */
    fetchLocalRepository(url) {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(url, (error, result) => {
                if (!error) { // 没有错误时，直接将数据返回给调用者
                    try {
                        resolve((JSON.parse(result)));
                    } catch (e) {
                        reject(e);
                    }
                } else { // 如果有错误，则将错误信息返给调用者
                    reject(error);
                }
            })
        })
    }

    /**
     * 获取网络数据
     * @param url
     * @returns {Promise}
     */
    fetchNetRepository(url) {
        return new Promise((resolve, reject) => {

            if (this.flag === FLAG_STORAGE.flag_trending) {
                this.trending.fetchTrending(url)
                    .then(result => {
                        if (!result) {// 如果数据为空，则告诉调用者数据为空
                            reject(new Error('responseData is null'));
                            return;
                        }
                        resolve(result);
                        // 缓存一份数据到本地
                        this.saveRepository(url, result);
                    })
                    .catch(error => reject(error))
            } else {
                fetch(url).then(response => response.json())
                    .then(result => {
                        if (!result) {// 如果数据为空，则告诉调用者数据为空
                            reject(new Error('responseData is null'));
                            return;
                        }

                        if (this.flag === FLAG_STORAGE.flag_my && result) {
                            // 缓存一份数据到本地
                            this.saveRepository(url, result);
                            resolve(result.items);
                        } else if (result && result.items) {
                            // 缓存一份数据到本地
                            this.saveRepository(url, result.items);
                            resolve(result.items);
                        } else {
                            reject(new Error('responseData is null'));
                        }
                    })
                    .catch(error => reject(error))
            }
        });
    }

    /**
     * 将数据缓存到本地
     * @param url
     * @param items
     */
    saveRepository(url, items) {
        if (!url || !items) return;
        let wrapData;
        if (this.flag === FLAG_STORAGE.flag_my) {
            wrapData = {item: items, update_date: new Date().getTime()}
        } else {
            wrapData = {items: items, update_date: new Date().getTime()}
        }
        AsyncStorage.setItem(url, JSON.stringify(wrapData));
    }

}