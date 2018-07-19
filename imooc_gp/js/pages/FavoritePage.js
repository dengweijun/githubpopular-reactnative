import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    ListView,
    RefreshControl,
    DeviceEventEmitter
} from 'react-native';

import NavigationBar from '../common/NavigationBar';
import {FLAG_STORAGE} from '../expand/dao/DataRepository';
import ScrollableTabView, {ScrollableTabBar, DefaultTabBar} from 'react-native-scrollable-tab-view';
import RepositoryCell from '../common/RepositoryCell';
import ProjectModel from '../model/ProjectModel';
import FavoriteDao from "../expand/dao/FavoriteDao";
import TrendingCell from "../common/TrendingCell";
import ArrayUtils from "../util/ArrayUtils";
import ViewUtils from '../util/ViewUtils';
import ActionUtils from "../util/ActionUtils";
import MoreMenu, {MORE_MENU} from '../common/MoreMenu';
import {FLAG_TAB} from './HomePage';
import BaseComponent from './BaseComponent';
import CustomThemePage from './my/CustomTheme';

export default class FavoritePage extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            theme: this.props.theme,
            customThemeViewVisble: false,
        }
    }

    renderMoreView() {
        let params = {...this.props, fromPage: FLAG_TAB.flag_popularTab}
        return <MoreMenu
            ref='moreMenu'
            menus={[MORE_MENU.Custom_Theme, MORE_MENU.Share, MORE_MENU.About_Author, MORE_MENU.About]}
            {...params}
            anchorView={() => this.refs.moreMenuButton}
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
            backgroundColor: this.state.theme.themeColor
        }
        let rightButton = ViewUtils.getMoreButton(() => this.refs.moreMenu.open())
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'收藏'}
                    style={this.state.theme.styles.navBar}
                    statusBar={statusBar}
                    rightButton={rightButton}
                />
                <ScrollableTabView
                    style={styles.container}
                    tabBarBackgroundColor={this.state.theme.themeColor}
                    renderTabBar={() => <ScrollableTabBar/>}
                    tabBarUnderlineStyle={styles.lineStyle}
                    tabBarInactiveTextColor='mintcream'
                    tabBarActiveTextColor='white'>
                    <FavoriteTab flag={FLAG_STORAGE.flag_popular} tabLabel={'最热'} {...this.props}></FavoriteTab>
                    <FavoriteTab flag={FLAG_STORAGE.flag_trending} tabLabel={'趋势'} {...this.props}></FavoriteTab>

                </ScrollableTabView>
                {this.renderMoreView()}
                {this.renderCustomThemeView()}
            </View>

        )

    }
}

class FavoriteTab extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            isLoading: false,
            unFavoriteArrs: [],
            theme: this.props.theme
        }
        this.favoriteChange = false;
        this.favoriteDao = new FavoriteDao(this.props.flag);
    }

    componentDidMount() {
        this.onLoad(true);
    }

    componentWillReceiveProps(nextProps) {
        this.onLoad(false);
    }

    /**
     * 更新Project Item Favorite状态(收藏状态)
     * @param items
     */
    updateDataSource(projectModelArr) {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(projectModelArr),
            isLoading: false
        });
    }

    onLoad(showLoading) {
        if (showLoading) {
            this.setState({
                isLoading: true
            })
        }

        this.favoriteDao.getAllItems().then(items => {
            let projectModelArr = [];
            if (items) {
                try {
                    items.map((result, i, arr) => {
                        projectModelArr.push(new ProjectModel(arr[i], true));
                    })
                    this.updateDataSource(projectModelArr);
                } catch (e) {
                    this.setState({
                        isLoading: false
                    });
                }
            }
        }).catch(e => {
            this.setState({
                isLoading: false
            });
        })
    }

    /**
     * 点击收藏图片的回调方法：将新的收藏数据保存到数据库中
     * @param item
     * @param isFavorite
     */
    onFavorite(item, isFavorite) {
        this.favoriteChange = true;
        ActionUtils.onFavorite(this.favoriteDao, item, isFavorite, this.props.flag);
        ArrayUtils.updateArray(this.state.unFavoriteArrs, item);
        if (this.state.unFavoriteArrs.length > 0) {// length>0:说明有取消收藏的项目，则发送通知更新
            if (this.props.flag === FLAG_STORAGE.flag_popular) {
                DeviceEventEmitter.emit('favoriteChanged_popular');
            } else {
                DeviceEventEmitter.emit('favoriteChanged_trending');
            }
        }
    }

    renderRow(projectModel) {
        let CellComponent = this.props.flag === FLAG_STORAGE.flag_popular ? RepositoryCell : TrendingCell;
        let key = this.props.flag === FLAG_STORAGE.flag_popular ? projectModel.item.id : projectModel.item.fullName;
        return <CellComponent
            onSelect={() => ActionUtils.onSelect({
                projectModel: projectModel,
                flag: FLAG_STORAGE.flag_popular,
                projectModel: projectModel,
                ...this.props
            })}
            theme={this.props.theme}
            key={key}
            projectModel={projectModel}
            onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
        />

    }

    render() {
        return (
            <View style={{flex: 1}}>
                <ListView
                    enableEmptySections={true}
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