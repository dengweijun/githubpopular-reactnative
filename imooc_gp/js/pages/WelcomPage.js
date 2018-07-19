import React, {Component} from 'react';
import {
    View,
    Text,
} from 'react-native';

import HomePage from './HomePage';
import SplashScreen from 'react-native-splash-screen';
import ThemeDao from '../expand/dao/ThemeDao';
import NavigatorUtils from '../util/NavigatorUtils';

export default class WelcomPage extends Component {

    componentDidMount() {

        new ThemeDao().getTheme().then(result => {
            this.theme = result;
        })

        this.timer = setTimeout(() => {
            SplashScreen.hide();
            NavigatorUtils.resetToHomePage({
                navigation: this.props.navigation,
                theme: this.theme
            });

        }, 800)
    }

    componentWillUnmount() {
        // 如果timer不为空，则移除定时器timer
        this.timer && clearTimeout(this.timer);
    }

    render() {

        return null;

    }
}