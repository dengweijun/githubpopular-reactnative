import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    ListView,
    RefreshControl,
    DeviceEventEmitter,
    TouchableOpacity,
    Text,
    Image
} from 'react-native';

import NavigationBar from '../common/NavigationBar';
import DataRepository, {FLAG_STORAGE} from '../expand/dao/DataRepository';
import ScrollableTabView, {ScrollableTabBar, DefaultTabBar} from 'react-native-scrollable-tab-view';
import TrendingCell from '../common/TrendingCell';
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import ProjectModel from '../model/ProjectModel';
import FavoriteDao from "../expand/dao/FavoriteDao";
import Utils from '../util/Utils';
import ViewUtils from '../util/ViewUtils';
import ActionUtils from '../util/ActionUtils';
import MoreMenu, {MORE_MENU} from '../common/MoreMenu';
import {FLAG_TAB} from './HomePage';
import BaseComponent from './BaseComponent';
import CustomThemePage from './my/CustomTheme';
import TrendingDialog, {timeSpanArray} from '../common/TrendingDialog';

const API_URL = 'https://github.com/trending/';

var dataRepository = new DataRepository(FLAG_STORAGE.flag_trending);
var favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending);
export default class TrendingPage extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            languages: [],
            isVisible: false,
            timeSpan: timeSpanArray[0],// 默认为今天
            theme: this.props.theme,
            customThemeViewVisble: false,
        }
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_language);
    }

    componentDidMount() {
        super.componentDidMount();
        this.loadData();
    }

    loadData() {
        this.languageDao.fetch().then(result => {
            this.setState({
                languages: result
            })
        }).catch(error => {
            console.log(error)
        })
    }

    renderTitleView() {
        // TouchableOpacity只能包含一个子view
        return <TouchableOpacity
            ref='button'
            onPress={() => this.showPopover()}>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.titleText}>趋势 {this.state.timeSpan.showText} </Text>
                <Image style={{width: 12, height: 12, marginLeft: 5}}
                       source={require('../../res/images/ic_spinner_triangle.png')}/>

            </View>

        </TouchableOpacity>
    }

    showPopover() {
        this.dialog.show();
    }

    closePopover() {
        this.dialog.dismiss();
    }

    onSelectedTimeSpan(timeSpan) {
        this.closePopover();
        this.setState({
            timeSpan: timeSpan
        })
    }

    renderMoreView() {
        let params = {...this.props, fromPage: FLAG_TAB.flag_popularTab}
        return <MoreMenu
            ref='moreMenu'
            menus={[MORE_MENU.Custom_Language, MORE_MENU.Sort_Language,
                MORE_MENU.Custom_Theme, MORE_MENU.Share, MORE_MENU.About_Author, MORE_MENU.About]}
            {...params}
            onMoreMenuSelect={(theme) => {
                if (theme === MORE_MENU.Custom_Theme) {
                    this.setState({
                        customThemeViewVisble: true
                    })
                }
            }}
        />
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

    renderTrendingDialog() {
        return <TrendingDialog
            ref={dialog => this.dialog = dialog}
            onSelect={(tab) => this.onSelectedTimeSpan(tab)}
        />
    }

    render() {

        let rightButton = ViewUtils.getMoreButton(() => this.refs.moreMenu.open())
        let statusBar = {
            backgroundColor: this.state.theme.themeColor
        }
        return (
            <View style={styles.container}>
                <NavigationBar
                    titleView={this.renderTitleView()}
                    style={this.state.theme.styles.navBar}
                    statusBar={statusBar}
                    rightButton={rightButton}
                />
                {/*当加载完标签后，再加载ScrollableTabView，否则会报错*/}
                {this.state.languages.length > 0 ?

                    <ScrollableTabView
                        style={styles.container}
                        tabBarBackgroundColor={this.state.theme.themeColor}
                        renderTabBar={() => <ScrollableTabBar/>}
                        tabBarUnderlineStyle={styles.lineStyle}
                        tabBarInactiveTextColor='mintcream'
                        tabBarActiveTextColor='white'>
                        {this.state.languages.map((result, i, arr) => {
                            let lan = arr[i];
                            return lan.checked ?
                                <TrendingTab key={lan.name}
                                             timeSpan={this.state.timeSpan}
                                             tabLabel={lan.name} {...this.props}></TrendingTab> : null
                        })}

                    </ScrollableTabView>
                    : null
                }
                {this.renderMoreView()}
                {this.renderCustomThemeView()}
                {this.renderTrendingDialog()}
            </View>

        )

    }
}

class TrendingTab extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            isLoading: false,
            favoriteKeys: [],
            theme: this.props.theme
        }
        this.favoriteChange = false;
    }

    genUrl(category, timeSpan) {// obejct:timeSpan
        return API_URL + category + '?' + timeSpan.searchText;
    }

    componentDidMount() {
        this.onLoad(this.props.timeSpan);
        // 注册一个监听，监听收藏页面的操作
        this.listener = DeviceEventEmitter.addListener('favoriteChanged_trending', () => {
            this.favoriteChange = true;
        })
    }

    componentWillUnmount() {
        if (this.listener) this.listener.remove();
    }

    /**
     * 更新Project Item Favorite状态(收藏状态)
     * @param items
     */
    updateDataSource() {
        let projectModelArr = [];
        for (let i = 0; i < this.items.length; i++) {
            projectModelArr.push(new ProjectModel(this.items[i], Utils.checkFavoriteKey(this.items[i], this.state.favoriteKeys)));
        }

        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(projectModelArr),
            isLoading: false
        });
    }

    /**
     * 获取所有收藏的Key集合
     */
    getFavoriteKeys() {
        favoriteDao.getFavoriteKeys().then(keys => {
            if (keys) {
                this.setState({
                    favoriteKeys: keys
                })
                this.updateDataSource();
            }
        }).catch(e => {
            this.updateDataSource();
        })
    }

    // 对props做处理
    componentWillReceiveProps(nextProps) {
        if (this.favoriteChange) {
            this.favoriteChange = false;
            this.getFavoriteKeys();
        } else if (nextProps.timeSpan !== this.props.timeSpan) {
            this.onLoad(nextProps.timeSpan);
        } else if (nextProps.theme !== this.state.theme) {
            this.setState({
                theme: nextProps.theme
            })
            this.updateDataSource();
        }
    }

    onLoad(timeSpan) {
        this.setState({
            isLoading: true
        })
        let url = this.genUrl(this.props.tabLabel, timeSpan);
        dataRepository.fetchRepository(url)
            .then(result => {
                this.items = result && result.items ? result.items : result ? result : [];
                this.getFavoriteKeys();
                // 如果数据过时，则获取网络数据
                if (result && result.update_date && !Utils.checkDate(result.update_date)) {
                    // DeviceEventEmitter.emit('showToast', '数据过时');
                    return dataRepository.fetchNetRepository(url);
                } else {
                    // 其实这里提示是不正确的，因为fetchRepository(url)当本地没有数据时，会调用网络方法，所以这里有可能是网络数据
                    // DeviceEventEmitter.emit('showToast', '显示本地数据');
                }
            })
            .then(items => {
                if (!items || items.length === 0) {
                    return;
                }
                this.items = items;
                this.getFavoriteKeys();
                // DeviceEventEmitter.emit('showToast', '显示网络数据');
            })
            .catch(error => {
                console.log(error);
            })
    }

    renderRow(projectModel) {
        return <TrendingCell
            onSelect={() => ActionUtils.onSelect({
                projectModel: projectModel,
                flag: FLAG_STORAGE.flag_trending,
                projectModel: projectModel,
                ...this.props
            })}
            key={projectModel.item.id}
            projectModel={projectModel}
            theme={this.state.theme}
            onFavorite={(item, isFavorite) => ActionUtils.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_trending)}
        />

    }

    render() {
        return (
            <View style={{flex: 1}}>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(data) => this.renderRow(data)}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isLoading}
                            onRefresh={() => this.onLoad(this.props.timeSpan)}
                            colors={[this.state.theme.themeColor]}
                            tintColor={this.state.theme.themeColor}
                            title={'Loading...'}
                            titleColor={this.state.theme.themeColor}
                        />

                    }
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },
    lineStyle: {
        height: 2,
        backgroundColor: 'white',
    },
    textStyle: {
        flex: 1,
        fontSize: 20,
        marginTop: 20,
        textAlign: 'center',
    },
    titleText: {
        fontSize: 18,
        color: 'white'
    }

})