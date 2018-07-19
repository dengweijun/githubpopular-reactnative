import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Platform,
    StatusBar,
    ViewPropTypes,
    DeviceInfo
} from 'react-native';

import PropTypes from 'prop-types';

const NAV_BAR_HEIGHT_ANDROID = 50;
const NAV_BAR_HEIGHT_IOS = 44;
const STATUS_BAR_HEIGHT = DeviceInfo.isIPhoneX_deprecated ? 0 : 20;
const StatusBarShape = {
    backgroundColor: PropTypes.string,
    barStyle: PropTypes.oneOf(['default', 'light-content', 'dark-content']),
    hidden: PropTypes.bool
}

export default class NavigationBar extends Component {
    // 设置属性约束
    static propTypes = {
        style: ViewPropTypes.style,
        title: PropTypes.string,
        titleView: PropTypes.element,// 作为一个元素传进来
        titleLayoutStyle: ViewPropTypes.style,
        hide: PropTypes.bool,
        leftButton: PropTypes.element,
        rightButton: PropTypes.element,
        statusBar: PropTypes.shape(StatusBarShape)
    }

    static defaultProps = {
        statusBar: {
            barStyle: 'light-content',
            hidden: false
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            hide: false
        }
    }

    render() {
        let status =
            <View
                style={styles.statusBar}>
                <StatusBar {...this.props.statusBar}/>
            </View>
        let titleView = this.props.titleView ? this.props.titleView :
            <Text ellipsizeMode='head' numberOfLines={1} style={styles.text}> {this.props.title}</Text>
        let content = <View style={styles.navBar}>
            <View style={styles.button}>
                {this.props.leftButton}
            </View>
            <View style={[this.props.titleLayoutStyle, styles.titleViewContainer]}>
                {titleView}
            </View>
            <View>
                {this.props.rightButton}
            </View>

        </View>
        return (

            <View style={[styles.container, this.props.style]}>
                {status}
                {content}
            </View>


        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#2196F3',

    },
    text: {
        color: 'white',
        fontSize: 20
    },
    navBar: {
        alignItems: 'center',
        justifyContent: 'space-between',
        height: Platform.OS === 'ios' ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID,
        flexDirection: 'row'
    },
    titleViewContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: 40,
        right: 40,
        top: 0,
        bottom: 0
    },
    statusBar: {
        height: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT : 0
    },
    button: {
        alignItems: 'center'
    }


})

