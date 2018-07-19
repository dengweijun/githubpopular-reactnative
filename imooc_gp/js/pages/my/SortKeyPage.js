import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableHighlight,
    ScrollView,
    Image,
    TouchableOpacity,
    Alert,
    DeviceEventEmitter
} from 'react-native';

import NavigationBar from '../../common/NavigationBar';
import SafeAreaViewPlus from '../../common/SafeAreaViewPlus';
import LanguageDao, {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao';
import SortableListView from 'react-native-sortable-listview';
import ArrayUtils from '../../util/ArrayUtils';
import ViewUtils from '../../util/ViewUtils';
import {ACTION_HOME, FLAG_TAB} from '../HomePage';
import NavigatorUtils from '../../util/NavigatorUtils';

export default class CustomKeyPage extends Component {

    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.languageDao = new LanguageDao(this.params.flag);
        this.dataArray = [];// 初始的标签数组（所有的）
        this.sortedKeyArray = [];// 排序后的标签数组（所有的）
        this.originalCheckedArray = [];// 原始的标签数组（已选中的）
        this.state = {
            checkedArray: [],// 移动后的标签数组（已选中的）
            theme: this.params.theme
        }
    }

    getKeyData(data) {
        this.dataArray = data;
        let checkedArray = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].checked) checkedArray.push(data[i]);
        }
        this.setState({
            checkedArray: checkedArray
        })
        this.originalCheckedArray = ArrayUtils.clone(checkedArray);
        this.sortedKeyArray = ArrayUtils.clone(this.dataArray);
    }

    loadData() {
        this.languageDao.fetch().then(result => {
            this.getKeyData(result)
        }).catch(error => {
            console.log(error)
        })
    }

    componentDidMount() {
        this.loadData();
    }

    onBack() {
        // 如果数据相等，说明没有改变，则直接返回
        if (ArrayUtils.isEqual(this.originalCheckedArray, this.state.checkedArray)) {
            NavigatorUtils.goBack(this.props.navigation);
            return;
        }
        Alert.alert(
            '提示',
            '要保存修改吗?',
            [
                {
                    text: '不保存', onPress: () => {
                    NavigatorUtils.goBack(this.props.navigation);
                }
                },
                {
                    text: '保存', onPress: () => {
                    this.onSave(true);
                }
                },
            ],
            {cancelable: false}
        )
    }

    /**
     * 保存数据
     * @param isChecked：true表示已经判断过数据的变化情况，则不需要再次判断；false表示还没有判断，则需要判断
     */
    onSave(isChecked) {
        // 如果数据相等，说明没有改变，则直接返回
        if (!isChecked && ArrayUtils.isEqual(this.originalCheckedArray, this.state.checkedArray)) {
            NavigatorUtils.goBack(this.props.navigation);
            return;
        }
        this.getSortedKey();
        this.languageDao.save(this.sortedKeyArray);
        let jumpToTab = this.params.flag === FLAG_LANGUAGE.flag_key ? FLAG_TAB.flag_popularTab : FLAG_TAB.flag_trendingTab;
        DeviceEventEmitter.emit("ACTION_HOME", ACTION_HOME.A_RESTART, jumpToTab);
    }

    /**
     * 更新最后排序的标签数组：sortedKeyArray
     */
    getSortedKey() {
        for (let i = 0; i < this.originalCheckedArray.length; i++) {
            let item = this.originalCheckedArray[i];
            let index = this.dataArray.indexOf(item);
            // 将checkedArray的数据一个个替换到sortedKeyArray对应的位置
            this.sortedKeyArray.splice(index, 1, this.state.checkedArray[i]);
        }
    }

    render() {

        let rightButton = <TouchableOpacity>
            <View>
                <Text style={styles.text}
                      onPress={() => {
                          this.onSave();
                      }}
                >
                    保存
                </Text>

            </View>
        </TouchableOpacity>

        let title = this.params.flag === FLAG_LANGUAGE.flag_key ? "标签排序" : "语言排序"
        let statusBar = {
            backgroundColor: this.state.theme.themeColor
        }
        return <SafeAreaViewPlus topColor={this.state.theme.themeColor}>
            <NavigationBar
                title={title}
                style={this.state.theme.styles.navBar}
                statusBar={statusBar}
                leftButton={ViewUtils.getLeftButton(() => this.onBack())}
                rightButton={rightButton}
            />
            <SortableListView
                style={{flex: 1}}
                data={this.state.checkedArray}
                order={Object.keys(this.state.checkedArray)}
                onRowMoved={e => {
                    this.state.checkedArray.splice(e.to, 0, this.state.checkedArray.splice(e.from, 1)[0])
                    this.forceUpdate()
                }}
                renderRow={row => <SortCell theme={this.state.theme} data={row}/>}
            />
        </SafeAreaViewPlus>

    }
}

class SortCell extends Component {
    render() {
        return <TouchableHighlight
            underlayColor={'#eee'}
            style={styles.item}
            {...this.props.sortHandlers}
        >
            <View style={styles.row}>
                <Image style={[styles.image, this.props.theme.styles.tabBarSelectedIcon]}
                       source={require('./images/ic_sort.png')}></Image>
                <Text>{this.props.data.name}</Text>
            </View>
        </TouchableHighlight>
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
        padding: 15,
        backgroundColor: '#FFF',
        borderBottomWidth: 0.5,
        borderColor: '#eee',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    image: {
        width: 16,
        height: 16,
        marginRight: 10
    }
})