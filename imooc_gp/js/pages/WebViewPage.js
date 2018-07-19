import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    WebView,
    TextInput,
    DeviceEventEmitter,
    Platform,
    BackHandler,
    ToastAndroid
} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import GlobalStyles from '../../res/styles/GlobalStyles';
import ViewUtils from '../util/ViewUtils';
import NavigatorUtils from '../util/NavigatorUtils';

export default class WebViewPage extends Component {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.state = {
            url: this.params.url,
            title: this.params.title,
            canGoBack: false
        }
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

    goBack() {
        if (this.state.canGoBack) {
            this.webView.goBack();
        } else {
            NavigatorUtils.goBack(this.props.navigation);
        }
    }

    onNavigationStateChange(e) {
        this.setState({
            url: e.url,
            canGoBack: e.canGoBack
        })
    }

    render() {
        return (
            <SafeAreaViewPlus
                topColor={this.params.theme.themeColor}
                style={GlobalStyles.root_container}>
                <NavigationBar
                    title={this.state.title}
                    style={this.params.theme.styles.navBar}
                    leftButton={ViewUtils.getLeftButton(() => this.goBack())}
                />
                <WebView
                    ref={webView => this.webView = webView}
                    source={{uri: this.state.url}}
                    onNavigationStateChange={(e) => this.onNavigationStateChange(e)}
                />

            </SafeAreaViewPlus>

        );
    }
}