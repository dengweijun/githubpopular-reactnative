import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Alert,
    DeviceEventEmitter
} from 'react-native';

import NavigationBar from '../../common/NavigationBar';
import SafeAreaViewPlus from '../../common/SafeAreaViewPlus';
import ViewUtils from '../../util/ViewUtils';
import LanguageDao, {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao';
import CheckBox from 'react-native-check-box';
import ArrayUtils from '../../util/ArrayUtils';
import {ACTION_HOME, FLAG_TAB} from '../HomePage';
import NavigatorUtils from '../../util/NavigatorUtils';

export default class CustomKeyPage extends Component {

    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.isRemovedKey = this.params.isRemovedKey ? true : false;// 如果有传过来，则为true；否则为false
        this.languageDao = new LanguageDao(this.params.flag);
        this.changeValues = [];
        this.state = {
            dataArray: [],
            theme: this.params.theme
        }
    }

    loadData() {
        this.languageDao.fetch().then(result => {
            this.setState({
                dataArray: result
            })
        }).catch(error => {
            console.log(error)
        })
    }

    componentDidMount() {
        this.loadData();
    }

    onSave() {
        if (this.changeValues.length === 0) {
            NavigatorUtils.goBack(this.props.navigation);
            return;
        }
        if (this.isRemovedKey) {
            for (let i = 0; i < this.changeValues.length; i++) {
                ArrayUtils.remove(this.state.dataArray, this.changeValues[i]);
            }
        }
        this.languageDao.save(this.state.dataArray);
        let jumpToTab = this.params.flag === FLAG_LANGUAGE.flag_key ? FLAG_TAB.flag_popularTab : FLAG_TAB.flag_trendingTab;
        DeviceEventEmitter.emit("ACTION_HOME", ACTION_HOME.A_RESTART, jumpToTab);
    }

    onBack() {
        if (this.changeValues.length === 0) {
            NavigatorUtils.goBack(this.props.navigation)
            return;
        }
        Alert.alert(
            '提示',
            '要保存修改吗?',
            [
                {
                    text: '不保存', onPress: () => {
                    NavigatorUtils.goBack(this.props.navigation)
                }
                },
                {
                    text: '保存', onPress: () => {
                    this.onSave();
                }
                },
            ],
            {cancelable: false}
        )
    }

    onClick(data) {
        // 当不是标签移除时(即为自定义标签页面)，才修改data的checked值；否则，不修改
        if (!this.isRemovedKey) data.checked = !data.checked;
        // 记录用户是否修改了标签，如果修改了则保存；
        // this.changeValues.length > 0则表示修改了
        ArrayUtils.updateArray(this.changeValues, data);

    }

    renderCheckBox(data) {
        let leftText = data.name;
        // 当为标签移除时，checkbox默认进来都为不选中；否则根据data.checked赋值
        let isChecked = this.isRemovedKey ? false : data.checked;
        return (
            <CheckBox
                style={{flex: 1, padding: 10}}
                onClick={() => {
                    this.onClick(data);
                }}
                leftText={leftText}
                isChecked={isChecked}
                checkedImage={<Image style={this.state.theme.styles.tabBarSelectedIcon}
                                     source={require('./images/ic_check_box.png')}/>}
                unCheckedImage={<Image style={this.state.theme.styles.tabBarSelectedIcon}
                                       source={require('./images/ic_check_box_outline_blank.png')}/>}
            />
        )
    }

    renderView() {
        if (!this.state.dataArray || this.state.dataArray.length === 0) return null;
        let length = this.state.dataArray.length;
        let views = [];
        for (let i = 0; i < length - 2; i += 2) {
            views.push(
                <View key={i}>
                    <View style={styles.item}>
                        {this.renderCheckBox(this.state.dataArray[i])}
                        {this.renderCheckBox(this.state.dataArray[i + 1])}
                    </View>
                    <View style={styles.line}></View>
                </View>
            );
        }
        views.push(
            <View key={length - 1}>
                <View style={styles.item}>
                    {length % 2 === 0 ? this.renderCheckBox(this.state.dataArray[length - 2]) : null}
                    {this.renderCheckBox(this.state.dataArray[length - 1])}
                </View>
                <View style={styles.line}></View>
            </View>
        )

        return views;
    }


    render() {
        let title = this.isRemovedKey ? '标签移除' : '自定义标签';
        title = this.params.flag === FLAG_LANGUAGE.flag_language ? '自定义语言' : title;
        let rightText = this.isRemovedKey ? '移除' : '保存';
        let rightButton = <TouchableOpacity>
            <View>
                <Text style={styles.text}
                      onPress={() => {
                          this.onSave();
                      }}
                >
                    {rightText}
                </Text>

            </View>
        </TouchableOpacity>
        let statusBar = {
            backgroundColor: this.state.theme.themeColor
        }
        return <SafeAreaViewPlus
            topColor={this.state.theme.themeColor}
        >
            <NavigationBar
                title={title}
                style={this.state.theme.styles.navBar}
                statusBar={statusBar}
                leftButton={ViewUtils.getLeftButton(() => this.onBack())}
                rightButton={rightButton}
            />
            <ScrollView>
                {this.renderView()}
            </ScrollView>
        </SafeAreaViewPlus>

    }
}

const styles = StyleSheet.create({
    text: {
        color: 'white',
        fontSize: 16,
        marginRight: 10
    },
    line: {
        height: 0.5,
        backgroundColor: 'darkgray'
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center'
    }
})