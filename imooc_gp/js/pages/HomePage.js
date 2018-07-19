/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    DeviceEventEmitter,
    Platform,
    BackHandler,
    ToastAndroid
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import PopularPage from "./PopularPage";
import TrendingPage from "./TrendingPage";
import MyPage from "./my/MyPage";
import Toast, {DURATION} from 'react-native-easy-toast';
import FavoritePage from './FavoritePage';
import BaseComponent from './BaseComponent';
import codePush from 'react-native-code-push';
import ThemeFactory, {ThemeFlags} from '../../res/styles/ThemeFactory';
import NavigatorUtils from "../util/NavigatorUtils";
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';

export const FLAG_TAB = {
    flag_popularTab: 'tb_popular',
    flag_trendingTab: 'tb_trending',
    flag_favoriteTab: 'tb_favorite',
    flag_my: 'tb_my'
}
export const ACTION_HOME = {A_SHOW_TOAST: 'showToast', A_RESTART: 'restart', A_THEME: 'theme'}
export default class HomePage extends BaseComponent {

    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        let selectedTab = this.params.selectedTab ? this.params.selectedTab : 'tb_popular';
        this.state = {
            selectedTab: selectedTab,
            // 如果theme不为空，则取theme；否则创建一个默认的theme
            theme: this.params.theme || ThemeFactory.createTheme(ThemeFlags.Default)
        }
    }

    /**
     * 向CodePush服务器检查更新
     */
    update() {
        codePush.sync({
            updateDialog: {
                appendReleaseDescription: true,
                descriptionPrefix: '更新内容',
                title: '更新',
                mandatoryUpdateMessage: '',
                mandatoryContinueButtonLabel: '更新',
            },
            mandatoryInstallMode: codePush.InstallMode.ON_NEXT_RESTART,
        });
    }

    componentDidMount() {
        super.componentDidMount();
        this.listener = DeviceEventEmitter.addListener('ACTION_HOME',
            (action, params) => {
                this.onAction(action, params)
            });
        this.update();
    }

    onAction(action, params) {
        if (action === ACTION_HOME.A_SHOW_TOAST) {
            this.toast.show(params.text);
        } else if (action === ACTION_HOME.A_RESTART) {
            NavigatorUtils.resetToHomePage({
                navigation: this.props.navigation,
                ...this.params,
                selectedTab: params
            })
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        // 这种写法等价于：if(this.listener) this.listener.remove();
        this.listener && this.listener.remove();

    }

    _renderTab(Component, selectedTab, title, imageIcon) {
        return (
            <TabNavigator.Item
                selected={this.state.selectedTab === selectedTab}
                title={title}
                selectedTitleStyle={this.state.theme.styles.selectedTitleStyle}
                renderIcon={() => <Image style={styles.image}
                                         source={imageIcon}/>}
                renderSelectedIcon={() => <Image style={[styles.image, this.state.theme.styles.tabBarSelectedIcon]}
                                                 source={imageIcon}/>}
                onPress={() => this.setState({selectedTab: selectedTab})}>
                <Component {...this.props} theme={this.state.theme}/>
            </TabNavigator.Item>
        )

    }

    render() {
        const Root = <SafeAreaViewPlus
            topColor={this.state.theme.themeColor}
            bottomInset={false}>
            <TabNavigator>
                {this._renderTab(PopularPage, FLAG_TAB.flag_popularTab, '最热', require('../../res/images/ic_polular.png'))}
                {this._renderTab(TrendingPage, FLAG_TAB.flag_trendingTab, '趋势', require('../../res/images/ic_trending.png'))}
                {this._renderTab(FavoritePage, FLAG_TAB.flag_favoriteTab, '收藏', require('../../res/images/ic_favorite.png'))}
                {this._renderTab(MyPage, FLAG_TAB.flag_my, '我的', require('../../res/images/ic_my.png'))}
            </TabNavigator>
            <Toast ref={toast => this.toast = toast}></Toast>
        </SafeAreaViewPlus>
        return Root;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    page1: {
        flex: 1,
        backgroundColor: "red"
    },
    page2: {
        flex: 1,
        backgroundColor: "#63B8FF"
    },
    image: {
        height: 22,
        width: 22
    }

});
