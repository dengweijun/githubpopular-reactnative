import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    WebView,
    TextInput,
    TouchableOpacity,
    Image,
    Platform,
    BackHandler,
    ToastAndroid
} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import ViewUtils from '../util/ViewUtils';
import FavoriteDao from '../expand/dao/FavoriteDao';
import UShare from '../common/UShare';
import share from '../../res/data/share.json';
import NavigatorUtils from '../util/NavigatorUtils';

const TrendingUrl = 'https://github.com/';
export default class RepositoryDetail extends Component {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        let item = this.params.projectModel.item ? this.params.projectModel.item : this.params.projectModel;
        this.state = {
            url: item.html_url ? item.html_url : TrendingUrl + item.fullName,
            title: item.full_name ? item.full_name : item.fullName,
            canGoBack: false,
            isFavorite: this.params.projectModel.isFavorite,
            favoriteIcon: this.params.projectModel.isFavorite ? require('../../res/images/ic_star.png') :
                require('../../res/images/ic_star_navbar.png'),
            theme: this.params.theme
        }
        this.favoriteDao = new FavoriteDao(this.params.flag);
    }

    componentDidMount() {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress', () => {
            });
        }

    }

    onBackAndroid = () => {
        if (this.state.canGoBack) {
            this.webView.goBack();
            return true;
        } else {
            return false;
        }
    };

    onBack() {
        if (this.state.canGoBack) {
            this.webView.goBack();
        } else {
            NavigatorUtils.goBack(this.props.navigation);
        }
    }

    onNavigationStateChange(e) {
        this.setState({
            canGoBack: e.canGoBack
        })
    }

    /**
     * 更新收藏图标的状态
     * @param isFavorite
     */
    setFavoriteState(isFavorite) {
        this.setState({
            isFavorite: isFavorite,
            favoriteIcon: isFavorite ? require('../../res/images/ic_star.png') :
                require('../../res/images/ic_star_navbar.png')
        })
    }

    /**
     * 点击收藏按钮
     */
    onRightButtonClick() {

        let projectModel = this.params.projectModel;
        projectModel.isFavorite = !projectModel.isFavorite;
        // 1.更新收藏图标
        this.setFavoriteState(projectModel.isFavorite)

        // 2.保存本地数据
        let key = projectModel.item.fullName ? projectModel.item.fullName : projectModel.item.id.toString();
        if (projectModel.isFavorite) {
            this.favoriteDao.saveFavoriteItem(key, JSON.stringify(projectModel.item));
        } else {
            this.favoriteDao.removeFavoriteItem(key);
        }
    }

    initRightButton() {
        return (
            <View style={{flexDirection: 'row'}}>
                {ViewUtils.getShareButton(() => {
                    let shareApp = share.share_app;
                    UShare.share(shareApp.title, shareApp.content, shareApp.imgUrl, shareApp.url, () => {
                    }, () => {
                    });
                })}

                <TouchableOpacity
                    onPress={() => {
                        this.onRightButtonClick();
                    }}
                >
                    <Image style={{width: 20, height: 20, marginRight: 10}} source={this.state.favoriteIcon}></Image>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        let statusBar = {
            backgroundColor: this.state.theme.themeColor
        }
        let titleLayoutStyle = this.state.title.length > 20 ? {paddingRight: 30} : null;
        return (
            <SafeAreaViewPlus
                topColor={this.state.theme.themeColor}
                bottomInset={true}
            >
                <NavigationBar
                    title={this.state.title}
                    style={this.state.theme.styles.navBar}
                    titleLayoutStyle={titleLayoutStyle}
                    statusBar={statusBar}
                    leftButton={ViewUtils.getLeftButton(() => this.onBack())}
                    rightButton={this.initRightButton()}
                />
                <WebView
                    ref={webView => this.webView = webView}
                    source={{uri: this.state.url}}
                    onNavigationStateChange={(e) => this.onNavigationStateChange(e)}
                    startInLoadingState={true}
                />

            </SafeAreaViewPlus>

        );
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "white",
    },
    text: {
        fontSize: 20,
        color: "black",
    },
    input: {
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
        height: 40,
        borderWidth: 0.5,
        borderRadius: 4,
        paddingLeft: 5
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10
    }

});