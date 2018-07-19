import React, {Component} from 'react';
import {
    AsyncStorage
} from 'react-native';
import ThemeFactory, {ThemeFlags} from '../../../res/styles/ThemeFactory';

const THEME_KEY = 'theme_key';
export default class LanguageDao {

    getTheme() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(THEME_KEY, (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (!result) {
                    this.saveTheme(ThemeFlags.Default);
                    result = ThemeFlags.Default;
                }
                resolve(ThemeFactory.createTheme(result));
            }).catch(e => {
            })
        })
    }

    /**
     * 保存选择的主题样式
     * @param themeFlag
     */
    saveTheme(themeFlag) {
        AsyncStorage.setItem(THEME_KEY, themeFlag, (error => {
        }));
    }

}