import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    ListView,
    RefreshControl,
    DeviceEventEmitter,
    TouchableOpacity,
    Image
} from 'react-native';

import NavigationBar from '../common/NavigationBar';
import DataRepository, {FLAG_STORAGE} from '../expand/dao/DataRepository';
import ScrollableTabView, {ScrollableTabBar, DefaultTabBar} from 'react-native-scrollable-tab-view';
import RepositoryCell from '../common/RepositoryCell';
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import ProjectModel from '../model/ProjectModel';
import FavoriteDao from "../expand/dao/FavoriteDao";
import Utils from '../util/Utils';
import ViewUtils from '../util/ViewUtils';
import ActionUtils from '../util/ActionUtils';
import SearchPage from './SearchPage';
import MoreMenu, {MORE_MENU} from '../common/MoreMenu';
import {FLAG_TAB} from './HomePage';
import BaseComponent from './BaseComponent';
import CustomThemePage from './my/CustomTheme';
import NavigatorUtils from '../util/NavigatorUtils';

const URL = 'https://api.github.com/search/repositories?q=';
const URL_STR = '&sort=stars';
var favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
var dataRepository = new DataRepository(FLAG_STORAGE.flag_popular);
export default class PopularPage extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            languages: [],
            theme: this.props.theme,
            customThemeViewVisble: false,
        }
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
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

    getRightButton() {
        return (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                    onPress={() => {
                        NavigatorUtils.goToSearchPage(this.props)
                    }}>
                    <View>
                        <Image
                            style={{width: 24, height: 24, padding: 5, marginRight: 10}}
                            source={require('../../res/images/ic_search_white_48pt.png')}/>
                    </View>
                </TouchableOpacity>
                {ViewUtils.getMoreButton(() => this.refs.moreMenu.open())}
            </View>)
    }

    renderMoreView() {
        let params = {...this.props, fromPage: FLAG_TAB.flag_popularTab}
        return <MoreMenu
            ref='moreMenu'
            menus={[MORE_MENU.Custom_Key, MORE_MENU.Sort_Key, MORE_MENU.Remove_Key,
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

    render() {
        let statusBar = {
            backgroundColor: this.state.theme.themeColor,
            barStyle: 'light-content'
        }
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'最热'}
                    style={this.state.theme.styles.navBar}
                    statusBar={statusBar}
                    rightButton={this.getRightButton()}
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
                                <PopularTab key={lan.name} tabLabel={lan.name} {...this.props}></PopularTab> : null
                        })}

                    </ScrollableTabView>
                    : null
                }
                {this.renderMoreView()}
                {this.renderCustomThemeView()}
            </View>

        )

    }
}

class PopularTab extends Component {

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

    genUrl(query) {
        return URL + query + URL_STR;
    }

    componentDidMount() {
        this.onLoad();
        // 注册一个监听，监听收藏页面的操作
        this.listener = DeviceEventEmitter.addListener('favoriteChanged_popular', () => {
            this.favoriteChange = true;
        })
    }

    componentWillUnmount() {
        if (this.listener) this.listener.remove();
    }

    componentWillReceiveProps(nextProps) {
        if (this.favoriteChange) {
            this.favoriteChange = false;
            this.getFavoriteKeys();
        } else if (nextProps.theme !== this.state.theme) {
            this.setState({
                theme: nextProps.theme
            })
            this.updateDataSource();
        }
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
                this.updateDataSource(this.items);
            }
        }).catch(e => {
            this.updateDataSource(this.items);
        })
    }

    onLoad() {
        this.setState({
            isLoading: true
        })
        let url = this.genUrl(this.props.tabLabel);
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

    onUpdateFavorite() {
        this.getFavoriteKeys();
    }

    renderRow(projectModel) {
        return <RepositoryCell
            onSelect={() => ActionUtils.onSelect({
                projectModel: projectModel,
                flag: FLAG_STORAGE.flag_popular,
                ...this.props,
                onUpdateFavorite: () => this.onUpdateFavorite()
            })}
            theme={this.state.theme}
            key={projectModel.item.id}
            projectModel={projectModel}
            onFavorite={(item, isFavorite) => ActionUtils.onFavorite(favoriteDao, item, isFavorite)}
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
                            onRefresh={() => this.onLoad()}
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

})