import React, {Component} from 'react';
import {Image, ScrollView, StyleSheet, Text, TouchableHighlight, View} from 'react-native';

import NavigationBar from '../../common/NavigationBar';
import GlobalStyles from '../../../res/styles/GlobalStyles';
import ViewUtils from '../../util/ViewUtils';
import {MORE_MENU} from "../../common/MoreMenu";
import {FLAG_LANGUAGE} from "../../expand/dao/LanguageDao";
import CustomKeyPage from './CustomKeyPage';
import SortKeyPage from './SortKeyPage';
import AboutPage from '../about/AboutPage';
import CustomThemePage from './CustomTheme';
import BaseComponent from '../../pages/BaseComponent';
import NavigatorUtils from '../../util/NavigatorUtils';

export default class MyPage extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            customThemeViewVisble: false,
            theme: this.props.theme
        }
    }

    onClick(tag) {
        let TargetComponent, params = {...this.props, menuType: tag};
        switch (tag) {
            case MORE_MENU.Custom_Language:
                TargetComponent = 'CustomKeyPage';
                params.flag = FLAG_LANGUAGE.flag_language;
                break;
            case MORE_MENU.Custom_Key:
                TargetComponent = 'CustomKeyPage';
                params.flag = FLAG_LANGUAGE.flag_key;
                break;
            case MORE_MENU.Sort_Language:
                TargetComponent = 'SortKeyPage';
                params.flag = FLAG_LANGUAGE.flag_language;
                break;
            case MORE_MENU.Sort_Key:
                TargetComponent = 'SortKeyPage';
                params.flag = FLAG_LANGUAGE.flag_key;
                break;
            case MORE_MENU.Remove_Key:
                TargetComponent = 'CustomKeyPage';
                params.flag = FLAG_LANGUAGE.flag_key;
                params.isRemovedKey = true;
                break;
            case MORE_MENU.About:
                TargetComponent = 'AboutPage';
                break;
            case MORE_MENU.Custom_Theme:
                this.setState({
                    customThemeViewVisble: true
                })
                break;
            case MORE_MENU.About_Author:
                TargetComponent = 'AboutMePage';
                break;
        }
        if (TargetComponent) {
            NavigatorUtils.goToMenu({...params}, TargetComponent);
        }
    }

    getItem(tag, icon, text) {
        return ViewUtils.getSettingItem(() => this.onClick(tag), icon, text, this.state.theme.styles.tabBarSelectedIcon, null);
    }

    renderCustomThemeView() {
        return <CustomThemePage
            visible={this.state.customThemeViewVisble}
            {...this.props}
            onClose={() => {
                this.setState({
                    customThemeViewVisble: false
                })
            }}
        />
    }


    render() {
        let statusBar = {
            backgroundColor: this.state.theme.themeColor
        }
        return <View style={GlobalStyles.root_container}>
            <NavigationBar
                title={'我的'}
                style={this.state.theme.styles.navBar}
                statusBar={statusBar}
            />

            <ScrollView>
                <TouchableHighlight
                    onPress={() => {
                        this.onClick(MORE_MENU.About)
                    }}>
                    <View style={styles.item}>

                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Image
                                style={[{
                                    width: 40,
                                    height: 40,
                                    marginRight: 10
                                }, this.state.theme.styles.tabBarSelectedIcon]}
                                source={require('../../../res/images/ic_trending.png')}
                            />
                            <Text>GitHub Populoar</Text>
                        </View>

                        <Image
                            style={[{width: 22, height: 22}, this.state.theme.styles.tabBarSelectedIcon]}
                            source={require('../../../res/images/ic_tiaozhuan.png')}
                        />

                    </View>
                </TouchableHighlight>
                {/*趋势管理*/}
                <View style={GlobalStyles.line}></View>
                <Text style={styles.groupTitle}>趋势管理</Text>
                <View style={GlobalStyles.line}></View>
                {/*自定义语言*/}
                {this.getItem(MORE_MENU.Custom_Language, require('./images/ic_custom_language.png'), '自定义语言')}
                <View style={GlobalStyles.line}></View>
                {/*语言排序*/}
                {this.getItem(MORE_MENU.Sort_Language, require('./images/ic_swap_vert.png'), '语言排序')}

                {/*标签管理*/}
                <View style={GlobalStyles.line}></View>
                <Text style={styles.groupTitle}>标签管理</Text>
                <View style={GlobalStyles.line}></View>
                {/*自定义标签*/}
                {this.getItem(MORE_MENU.Custom_Key, require('./images/ic_custom_language.png'), '自定义标签')}
                <View style={GlobalStyles.line}></View>
                {/*标签排序*/}
                {this.getItem(MORE_MENU.Sort_Key, require('./images/ic_swap_vert.png'), '标签排序')}
                <View style={GlobalStyles.line}></View>
                {/*标签移除*/}
                {this.getItem(MORE_MENU.Remove_Key, require('./images/ic_remove.png'), '标签移除')}

                {/*设置*/}
                <View style={GlobalStyles.line}></View>
                <Text style={styles.groupTitle}>设置</Text>
                <View style={GlobalStyles.line}></View>
                {/*自定义主题*/}
                {this.getItem(MORE_MENU.Custom_Theme, require('./images/ic_custom_theme.png'), '自定义主题')}
                <View style={GlobalStyles.line}></View>
                {/*关于作者*/}
                {this.getItem(MORE_MENU.About_Author, require('./images/ic_insert_emoticon.png'), '关于作者')}
            </ScrollView>
            {this.renderCustomThemeView()}
        </View>

    }

}

const styles = StyleSheet.create({

    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        height: 90,
        backgroundColor: 'white'
    },
    groupTitle: {
        fontSize: 12,
        color: 'grey',
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 5,
    }

})