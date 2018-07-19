import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Image,
    View,
    Text,
    ToastAndroid,
    BackHandler
} from 'react-native';
import AppNavigator from '../navigators/AppNavigator';

let routes = [];
let lastBackPressed = null;
export default class setup extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
        lastBackPressed = null;
    }

    onBackAndroid() {
        if (routes.length === 1) { // 根界面
            if (lastBackPressed && lastBackPressed + 2000 >= Date.now()) {
                return false;
            }
            lastBackPressed = Date.now();
            ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
            return true;
        }
    }

    render() {
        return (
            <AppNavigator
                onNavigationStateChange={(prevNav, nav, action) => {
                    routes = nav.routes;
                }}/>
        );
    }

}