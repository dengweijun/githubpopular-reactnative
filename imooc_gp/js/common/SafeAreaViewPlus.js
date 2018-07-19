import React, {Component} from 'react';
import {
    View, StyleSheet, ViewPropTypes, DeviceInfo, SafeAreaView
} from 'react-native';
import PropTypes from 'prop-types';

export default class SafeAreaViewPlus extends Component {

    constructor(props) {
        super(props);
    }

    static propTypes = {
        ...ViewPropTypes,
        topColor: PropTypes.string,
        bottomColor: PropTypes.string,
        enablePlus: PropTypes.bool,
        topInset: PropTypes.bool,
        bottomInset: PropTypes.bool
    };

    /**
     * topInset：false表示不启用顶部安全区域，true表示启用
     * bottomInset：false表示不启用顶部安全区域，true表示启用
     */
    static defaultProps = {
        topColor: 'transparent',
        bottomColor: '#f8f8f8',
        enablePlus: true,
        topInset: false,
        bottomInset: true
    }

    render() {
        const {enablePlus} = this.props;
        return enablePlus ? this.genSafeAreaViewPlus() : this.genSafeAreaView();

    }

    /**
     * 自定义的SafeAreaView
     */
    genSafeAreaViewPlus() {
        const {children, topColor, bottomColor, topInset, bottomInset} = this.props;
        return <View style={[styles.container, this.props.style]}>
            {this.getTopArea(topColor, topInset)}
            {children}
            {this.getBottomArea(bottomColor, bottomInset)}
        </View>
    }

    getTopArea(topColor, topInset) {
        return !DeviceInfo.isIPhoneX_deprecated || topInset ? null :
            <View style={[styles.topArea, {backgroundColor: topColor}]}/>
    }

    getBottomArea(bottomColor, bottomInset) {
        return !DeviceInfo.isIPhoneX_deprecated || bottomInset ? null :
            <View style={[styles.bottomArea, {backgroundColor: bottomColor}]}/>
    }

    /**
     * 系统自带的SafeAreaView
     * @return {XML}
     */
    genSafeAreaView() {
        return <SafeAreaView style={[styles.container, this.props.style]} {...this.props}>

            {this.props.children}

        </SafeAreaView>
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    topArea: {
        height: 44
    },
    bottomArea: {
        height: 34
    }
});