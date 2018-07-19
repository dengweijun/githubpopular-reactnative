import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableHighlight,
    Image,
    Dimensions,
    Platform,
    DeviceInfo,
} from 'react-native';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import ViewUtils from '../../util/ViewUtils';
import Utils from '../../util/Utils';
import ProjectModel from '../../model/ProjectModel';
import FavoriteDao from '../../expand/dao/FavoriteDao';
import {FLAG_STORAGE} from '../../expand/dao/DataRepository';
import RepositoryCell from '../../common/RepositoryCell';
import RepositoryUtils from '../../expand/dao/RepositoryUtils';
import config from '../../../res/data/config.json';
import ActionUtils from '../../util/ActionUtils';
import UShare from '../../common/UShare';
import share from '../../../res/data/share.json';
import NavigatorUtils from '../../util/NavigatorUtils';
import GlobalStyles from '../../../res/styles/GlobalStyles';

export var FLAG_ABOUT = {flag_about: 'about', flag_aboue_me: 'aboue_me'};

export default class AboutCommon {

    constructor(props, updateState, flag_about) {
        this.props = props;
        this.updateState = updateState;
        this.flag_about = flag_about;
        this.repositories = [];
        this.favoriteKeys = null;
        this.favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
        this.repositoryUtils = new RepositoryUtils(this);
    }

    componentDidMount() {
        if (this.flag_about === FLAG_ABOUT.flag_about) {// 关于页面
            this.repositoryUtils.fetchRepository(config.info.currentRepoUrl);
        } else {// 关于作者页面
            let urls = [];
            let items = config.items;
            for (let i = 0, len = items.length; i < len; i++) {
                urls.push(config.info.url + items[i]);
            }
            this.repositoryUtils.fetchRepositories(urls);
        }
    }

    /**
     * 通知数据发生改变
     * @param items
     */
    onNotifyDataChanged(items) {
        this.updateFavorite(items);
    }

    /**
     * 更新项目的收藏状态
     * @param repositories
     */
    async updateFavorite(repositories) {
        if (repositories) {
            this.repositories = repositories;
        }
        if (!this.repositories) return;
        if (!this.favoriteKeys) {// 当this.favoriteKeys为空时
            // await相当于同步操作，必须和async搭配使用，意思是等待执行完这个方法，才会继续往下执行
            this.favoriteKeys = await this.favoriteDao.getFavoriteKeys();
        }
        let projectModelArr = [];
        for (let i = 0; i < this.repositories.length; i++) {
            let data = this.repositories[i];
            data = data.item ? data.item : data;
            projectModelArr.push(new ProjectModel(
                data,
                Utils.checkFavoriteKey(data, this.favoriteKeys ? this.favoriteKeys : [])));
            // 也可以用下面这样写法
            // projectModelArr.push({
            //     item: data,
            //     isFavorite: Utils.checkFavoriteKey(this.repositories[i], this.favoriteKeys)
            // });
        }
        // 更新
        this.updateState({
            projectModelArr: projectModelArr
        })

    }

    /**
     * 创建项目视图
     * @param projectModelArr
     * @return {Array}
     */
    renderRepository(projectModelArr) {
        if (!projectModelArr || projectModelArr.length === 0) return null;
        let views = [];
        for (let i = 0; i < projectModelArr.length; i++) {
            let projectModel = projectModelArr[i];
            views.push(
                <RepositoryCell
                    onSelect={() => ActionUtils.onSelect({
                        projectModel: projectModel,
                        flag: FLAG_STORAGE.flag_popular,
                        ...this.props
                    })}
                    theme={this.props.theme}
                    key={projectModel.item.id}
                    projectModel={projectModel}
                    onFavorite={(item, isFavorite) => ActionUtils.onFavorite(this.favoriteDao, item, isFavorite)}
                />
            )
        }
        return views;
    }

    getParallaxConfig(params) {
        let config = {};
        config.renderBackground = () => (
            <View key="background">
                <Image source={{
                    uri: params.backgroundImg,
                    width: window.width,
                    height: PARALLAX_HEADER_HEIGHT
                }}/>
                <View style={{
                    position: 'absolute',
                    top: 0,
                    width: window.width,
                    backgroundColor: 'rgba(0,0,0,.4)',
                    height: PARALLAX_HEADER_HEIGHT
                }}/>
            </View>
        );
        config.renderForeground = () => (
            <View key="parallax-header" style={styles.parallaxHeader}>
                <Image style={styles.avatar} source={{
                    uri: params.avatar,
                    width: AVATAR_SIZE,
                    height: AVATAR_SIZE
                }}/>
                <Text style={styles.sectionSpeakerText}>
                    {params.name}
                </Text>
                <Text style={styles.sectionTitleText}>
                    {params.description}
                </Text>
            </View>
        );
        config.renderStickyHeader = () => (
            <View key="sticky-header" style={styles.stickySection}>
                <Text style={styles.stickySectionText}>{params.name}</Text>
            </View>
        );

        config.renderFixedHeader = () => (
            <View key="fixed-header" style={styles.fixedSection}>
                {ViewUtils.getLeftButton(() => {
                    NavigatorUtils.goBack(this.props.navigation);
                })}
                {ViewUtils.getShareButton(() => {
                    let shareApp;
                    if (this.flag_about === FLAG_ABOUT.flag_about) {
                        shareApp = share.share_blog;
                    } else {
                        shareApp = share.share_app;
                    }
                    UShare.share(shareApp.title, shareApp.content, shareApp.imgUrl, shareApp.url, () => {
                    }, () => {
                    });
                })}
            </View>
        );

        return config;
    }

    render(content, params) {
        if (this.flag_about === FLAG_ABOUT.flag_aboue_me && !params) {
            params = config.author;
        }
        let renderConfig = this.getParallaxConfig(params);
        return (
            <ParallaxScrollView
                backgroundColor={this.props.theme.themeColor}
                headerBackgroundColor="#333"
                stickyHeaderHeight={STICKY_HEADER_HEIGHT}
                parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
                backgroundSpeed={10}
                {...renderConfig}>
                {content}
            </ParallaxScrollView>
        )
    }

}

const window = Dimensions.get('window');

const AVATAR_SIZE = 120;
const ROW_HEIGHT = 60;
const PARALLAX_HEADER_HEIGHT = 350;
const STICKY_HEADER_HEIGHT = (Platform.OS === 'ios') ? GlobalStyles.nav_bar_height_ios + 20 + (DeviceInfo.isIPhoneX_deprecated ? 24 : 0) : GlobalStyles.nav_bar_height_android;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: window.width,
        height: PARALLAX_HEADER_HEIGHT
    },
    stickySection: {
        height: STICKY_HEADER_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: (Platform.OS === 'ios') ? 20 + (DeviceInfo.isIPhoneX_deprecated ? 24 : 0) : 0
    },
    stickySectionText: {
        color: 'white',
        fontSize: 20,
        margin: 10
    },
    fixedSection: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        top: 0,
        paddingTop: (Platform.OS === 'ios') ? 20 + (DeviceInfo.isIPhoneX_deprecated ? 24 : 0) : 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    fixedSectionText: {
        color: '#999',
        fontSize: 20
    },
    parallaxHeader: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
        paddingTop: 100
    },
    avatar: {
        marginBottom: 10,
        borderRadius: AVATAR_SIZE / 2
    },
    sectionSpeakerText: {
        color: 'white',
        fontSize: 24,
        paddingVertical: 5
    },
    sectionTitleText: {
        color: 'white',
        fontSize: 18,
        paddingVertical: 5
    },
    row: {
        overflow: 'hidden',
        paddingHorizontal: 10,
        height: ROW_HEIGHT,
        backgroundColor: 'white',
        borderColor: '#ccc',
        borderBottomWidth: 1,
        justifyContent: 'center'
    },
    rowText: {
        fontSize: 20
    }
});