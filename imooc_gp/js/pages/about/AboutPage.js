import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableHighlight,
    Image,
    Linking
} from 'react-native';
import ViewUtils from '../../util/ViewUtils';
import {MORE_MENU} from "../../common/MoreMenu";
import GlobalStyles from '../../../res/styles/GlobalStyles';
import AboutCommon, {FLAG_ABOUT} from './AboutCommon';
import WebViewPage from '../WebViewPage';
import NavigatorUtils from '../../util/NavigatorUtils';

export default class AboutPage extends Component {

    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.aboutCommon = new AboutCommon({
            ...this.params,
            navigation: this.props.navigation
        }, (dic) => this.updateState(dic), FLAG_ABOUT.flag_about);
        this.state = {
            projectModelArr: [],
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
            case MORE_MENU.Website:
                TargetComponent = 'WebViewPage';
                params.url = 'http://www.devio.org/io/GitHubPopular/';
                params.title = 'GitHub Popular';
                break;
            case MORE_MENU.About_Author:
                TargetComponent = 'AboutMePage';
                break;
            case MORE_MENU.Feedback:
                let url = 'mailto://291011424@qq.com';
                Linking.canOpenURL(url).then(supported => {
                    if (!supported) {
                        console.log('Can\'t handle url: ' + url);
                    } else {
                        return Linking.openURL(url);
                    }
                }).catch(err => console.error('An error occurred', err));
                break;
        }
        if (TargetComponent) {
            NavigatorUtils.goToMenu(params, TargetComponent);
        }
    }

    render() {
        let content =
            <View>
                {this.aboutCommon.renderRepository(this.state.projectModelArr)}
                {ViewUtils.getSettingItem(() => {
                    this.onClick(MORE_MENU.Website);
                }, require('../../../res/images/ic_computer.png'), MORE_MENU.Website.name, this.state.theme.styles.tabBarSelectedIcon, null)}
                <View style={GlobalStyles.line}></View>
                {ViewUtils.getSettingItem(() => {
                    this.onClick(MORE_MENU.About_Author);
                }, require('../my/images/ic_insert_emoticon.png'), MORE_MENU.About_Author.name, this.state.theme.styles.tabBarSelectedIcon, null)}
                <View style={GlobalStyles.line}></View>
                {ViewUtils.getSettingItem(() => {
                    this.onClick(MORE_MENU.Feedback);
                }, require('../../../res/images/ic_feedback.png'), MORE_MENU.Feedback.name, this.state.theme.styles.tabBarSelectedIcon, null)}

            </View>

        let params = {
            name: 'GitHub Popular',
            description: 'gitHub是一个面向开源及私有软件项目的托管平台，因为只支持git 作为唯一的版本库格式进行托管，故名gitHub。',
            avatar: 'https://avatars2.githubusercontent.com/u/25073134?s=460&v=4',
            backgroundImg: 'https://avatars2.githubusercontent.com/u/25073134?s=460&v=4'
        }
        return this.aboutCommon.render(content, params);
    }
}
