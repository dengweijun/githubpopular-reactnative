import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableHighlight,
    Image,
    Linking,
    Clipboard
} from 'react-native';
import ViewUtils from '../../util/ViewUtils';
import GlobalStyles from '../../../res/styles/GlobalStyles';
import AboutCommon, {FLAG_ABOUT} from './AboutCommon';
import Toast from 'react-native-easy-toast';
import WebViewPage from '../WebViewPage';
import NavigatorUtils from '../../util/NavigatorUtils';

const FLAG = {
    REPOSITORY: '开源项目',
    BLOG: {
        name: '技术博客',
        items: {
            PERSONAL_BLOG: {
                title: '个人博客',
                url: 'http://jiapenghui.com',
            },
            CSDN: {
                title: 'CSDN',
                url: 'http://blog.csdn.net/fengyuzhengfan',
            },
            JIANSHU: {
                title: '简书',
                url: 'http://www.jianshu.com/users/ca3943a4172a/latest_articles',
            },
            GITHUB: {
                title: 'GitHub',
                url: 'https://github.com/crazycodeboy',
            },
        }
    },
    CONTACT: {
        name: '联系方式',
        items: {
            QQ: {
                title: 'QQ',
                account: '1586866509',
            },
            Email: {
                title: 'Email',
                account: 'crazycodeboy@gmail.com',
            },
        }
    },
    QQ: {
        name: '技术交流群',
        items: {
            MD: {
                title: '移动开发者技术分享群',
                account: '335939197',
            },
            RN: {
                title: 'React Native学习交流群',
                account: '165774887',
            }
        },
    },
}
export default class AbouteMePage extends Component {

    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.aboutCommon = new AboutCommon({
            ...this.params,
            navigation: this.props.navigation
        }, (dic) => this.updateState(dic), FLAG_ABOUT.flag_aboue_me);
        this.state = {
            projectModelArr: [],
            showBlog: false,
            showRepository: false,
            showQQ: false,
            showContact: false,
            theme: this.params.theme
        }
    }

    componentDidMount() {
        this.aboutCommon.componentDidMount();
    }

    updateState(dic) {
        this.setState(dic);
    }

    onClick(tag) {
        let TargetComponent, params = {...this.params, menuType: tag};
        switch (tag) {
            case FLAG.BLOG:
                this.updateState({
                    showBlog: !this.state.showBlog
                })
                break;
            case FLAG.REPOSITORY:
                this.updateState({
                    showRepository: !this.state.showRepository
                })
                break;
            case FLAG.QQ:
                this.updateState({
                    showQQ: !this.state.showQQ
                })
                break;
            case FLAG.CONTACT:
                this.updateState({
                    showContact: !this.state.showContact
                })
                break;
            case FLAG.CONTACT.items.QQ:
                Clipboard.setString(tag.account);
                this.toast.show('QQ：' + tag.account + "已经复制到剪贴板");
                break;
            case FLAG.CONTACT.items.Email:
                let url = 'mailto://' + tag.account;
                Linking.canOpenURL(url).then(supported => {
                    if (!supported) {
                        console.log('Can\'t handle url: ' + url);
                    } else {
                        return Linking.openURL(url);
                    }
                }).catch(err => console.error('An error occurred', err));
                break;
            case FLAG.QQ.items.MD:
            case FLAG.QQ.items.RN:
                Clipboard.setString(tag.account);
                this.toast.show('群号：' + tag.account + "已经复制到剪贴板");
                break;
            case FLAG.BLOG.items.PERSONAL_BLOG:
            case FLAG.BLOG.items.CSDN:
            case FLAG.BLOG.items.JIANSHU:
            case FLAG.BLOG.items.GITHUB:
                TargetComponent = 'WebViewPage';
                params.url = tag.url;
                params.title = tag.title;
                break;

        }
        if (TargetComponent) {
            NavigatorUtils.goToMenu(params, TargetComponent);
        }

    }

    getClickIcon(isShow) {
        return isShow ? require('../../../res/images/ic_tiaozhuan_up.png') : require('../../../res/images/ic_tiaozhuan_down.png')
    }

    renderItems(dic, showAccount) {
        if (!dic) return null;
        let views = [];
        for (let i in dic) {
            let title = showAccount ? dic[i].title + ':' + dic[i].account : dic[i].title;
            views.push(
                <View key={i}>
                    {ViewUtils.getSettingItem(() => this.onClick(dic[i]), '', title, this.state.theme.styles.tabBarSelectedIcon)}
                    <View style={GlobalStyles.line}/>
                </View>
            )
        }
        return views;
    }

    render() {
        let content =
            <View>
                {ViewUtils.getSettingItem(() => {
                        this.onClick(FLAG.BLOG);
                    }, require('../../../res/images/ic_computer.png'), FLAG.BLOG.name, this.state.theme.styles.tabBarSelectedIcon,
                    this.getClickIcon(this.state.showBlog))}
                <View style={GlobalStyles.line}></View>
                {this.state.showBlog ? this.renderItems(FLAG.BLOG.items, false) : null}

                {ViewUtils.getSettingItem(() => {
                        this.onClick(FLAG.REPOSITORY);
                    }, require('../../../res/images/ic_code.png'), FLAG.REPOSITORY, this.state.theme.styles.tabBarSelectedIcon,
                    this.getClickIcon(this.state.showRepository))}
                <View style={GlobalStyles.line}></View>
                {this.state.showRepository ? this.aboutCommon.renderRepository(this.state.projectModelArr) : null}

                {ViewUtils.getSettingItem(() => {
                        this.onClick(FLAG.QQ);
                    }, require('../../../res/images/ic_computer.png'), FLAG.QQ.name, this.state.theme.styles.tabBarSelectedIcon,
                    this.getClickIcon(this.state.showQQ))}
                <View style={GlobalStyles.line}></View>
                {this.state.showQQ ? this.renderItems(FLAG.QQ.items, true) : null}

                {ViewUtils.getSettingItem(() => {
                        this.onClick(FLAG.CONTACT);
                    }, require('../../../res/images/ic_contacts.png'), FLAG.CONTACT.name, this.state.theme.styles.tabBarSelectedIcon,
                    this.getClickIcon(this.state.showContact))}
                <View style={GlobalStyles.line}></View>
                {this.state.showContact ? this.renderItems(FLAG.CONTACT.items, true) : null}

            </View>
        return (
            <View style={{flex: 1}}>
                {this.aboutCommon.render(content, null)}
                <Toast ref={toast => this.toast = toast}/>
            </View>
        )
    }
}
