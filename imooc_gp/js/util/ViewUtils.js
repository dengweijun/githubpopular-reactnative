import React, {Component} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Image,
    View,
    TouchableHighlight,
    Text
} from 'react-native';

export default class ViewUtils {
    static getLeftButton(callBack) {
        return <TouchableOpacity
            onPress={callBack}>
            <Image style={{width: 22, height: 22, margin: 10}}
                   source={require('../../res/images/ic_arrow_back_white_36pt.png')}></Image>
        </TouchableOpacity>
    }

    static getSettingItem(callBack, icon, text, tintStyle, expandableIcon) {
        return (
            <TouchableHighlight onPress={callBack}>
                <View style={styles.item}>

                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image
                            style={[{width: 20, height: 20, marginRight: 10}, tintStyle]}
                            source={icon}
                        />
                        <Text>{text}</Text>
                    </View>

                    <Image
                        style={[{width: 22, height: 22}, tintStyle]}
                        source={expandableIcon ? expandableIcon : require('../../res/images/ic_tiaozhuan.png')}
                    />

                </View>
            </TouchableHighlight>
        )
    }

    /**
     * 获取更多按钮
     * @param callBack
     * @return {XML}
     */
    static getMoreButton(callBack) {
        return <TouchableHighlight
            ref='moreMenuButton'
            underlayColor='transparent'
            style={{padding: 5}}
            onPress={callBack}>
            <View style={{paddingRight: 8}}>

                <Image
                    style={{width: 24, height: 24}}
                    source={require('../../res/images/ic_more_vert_white_48pt.png')}/>

            </View>

        </TouchableHighlight>
    }

    /**
     * 获取分享按钮
     * @param callBack
     * @return {XML}
     */
    static getShareButton(callBack) {
        return <TouchableHighlight
            underlayColor='transparent'
            onPress={callBack}>
            <Image
                style={{width: 20, height: 20, marginRight: 10, tintColor: 'white'}}
                source={require('../../res/images/ic_share.png')}/>
        </TouchableHighlight>
    }

}


const styles = StyleSheet.create({

    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        height: 60,
        backgroundColor: 'white'
    }

})