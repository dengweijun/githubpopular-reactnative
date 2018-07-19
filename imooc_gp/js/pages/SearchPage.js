import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Platform,
    TextInput,
    Text,
    TouchableOpacity,
    ListView,
    ActivityIndicator,
    DeviceEventEmitter,
    DeviceInfo
} from 'react-native';
import GlobalStyles from '../../res/styles/GlobalStyles';
import ViewUtils from "../util/ViewUtils";
import RepositoryCell from '../common/RepositoryCell';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import ProjectModel from '../model/ProjectModel';
import FavoriteDao from "../expand/dao/FavoriteDao";
import Utils from '../util/Utils';
import ActionUtils from '../util/ActionUtils';
import {FLAG_STORAGE} from '../expand/dao/DataRepository';
import Toast from 'react-native-easy-toast';
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import {ACTION_HOME} from './HomePage';
import makeCancelable from '../util/Cancelable';
import NavigatorUtils from '../util/NavigatorUtils';

const API_URL = 'https://api.github.com/search/repositories?q=';
const URL_STR = '&sort=stars';

export default class SearchPage extends Component {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
        this.keys = [];
        this.keyChange = false;
        this.favoriteKeys = [];
        this.state = {
            rightText: '搜索',
            isLoading: false,
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2
            }),
            showBottomButton: false,
            theme: this.params.theme
        }
    }

    componentDidMount() {
        this.initKeys();
    }

    componentWillUnmount() {
        if (this.keyChange) {
            DeviceEventEmitter.emit("ACTION_HOME", ACTION_HOME.A_RESTART);
        }
        // 如果cancelable不为空，则取消网络数据请求
        this.cancelable && this.cancelable.cancel();
    }

    /**
     * 获取所有标签
     */
    async initKeys() {
        this.keys = await this.languageDao.fetch();
    }

    /**
     * 检测添加的key是否已经存在于keys中
     * @param keys
     * @param key
     * @return {boolean}
     */
    checkKeyIsExist(keys, key) {
        for (let i = 0, len = keys.length; i < len; i++) {
            if (key.toLowerCase() === keys[i].name.toLowerCase()) {
                return true;
            }
        }
        return false;
    }

    genUrl(query) {
        return API_URL + query + URL_STR;
    }

    /**
     * 更新Project Item Favorite状态(收藏状态)
     * @param items
     */
    updateDataSource() {
        let projectModelArr = [];
        for (let i = 0; i < this.items.length; i++) {
            projectModelArr.push(new ProjectModel(this.items[i], Utils.checkFavoriteKey(this.items[i], this.favoriteKeys)));
        }

        this.updateState({
            dataSource: this.state.dataSource.cloneWithRows(projectModelArr),
            isLoading: false,
            rightText: '搜索'
        });
    }

    /**
     * 获取所有收藏的Key集合
     */
    getFavoriteKeys() {
        this.favoriteDao.getFavoriteKeys().then(keys => {
            if (keys) {
                this.favoriteKeys = keys ? keys : [];
                this.updateDataSource(this.items);
            }
        }).catch(e => {
            this.updateDataSource(this.items);
        })
    }

    /**
     * 搜索：加载数据
     */
    loadData() {
        this.updateState({
            isLoading: true
        });

        // 1.首先获取封装好的Promise(封装后的promise，可取消网络数据请求)
        this.cancelable = makeCancelable(fetch(this.genUrl(this.searchText)));
        // 2.然后再获取返回的数据
        this.cancelable.promise.then(response => response.json())
            .then(result => {
                // !this：表示当前页面已关闭
                if (!this || !result || !result.items || result.items.length === 0) {
                    this.toast.show(this.searchText + "没有搜索到数据");
                    this.updateState({isLoading: false, rightText: '搜索'})
                    return;
                }
                this.items = result.items;
                this.getFavoriteKeys();
                if (!this.checkKeyIsExist(this.keys, this.searchText)) {
                    this.updateState({showBottomButton: true});
                }
            }).catch(error => {
            this.updateState({isLoading: false, rightText: '搜索'})
        })
    }

    rightButtonClick() {
        this.refs.input.blur();
        if (this.state.rightText === '搜索') {
            this.updateState({
                rightText: '取消'
            });
            this.loadData();
        } else {
            this.updateState({
                isLoading: false,
                rightText: '搜索'
            });
            // 取消网络数据请求
            this.cancelable.cancel();
        }
    }

    updateState(dic) {
        this.setState(dic);
    }

    renderNavBar() {

        let leftButton = ViewUtils.getLeftButton(() => {
            this.refs.input.blur();
            NavigatorUtils.goBack(this.props.navigation);
        })

        let inputView = <TextInput
            ref='input'
            style={styles.textInput}
            autoCapitalize={'none'}
            onChangeText={text => this.searchText = text}
            underlineColorAndroid='transparent'
        ></TextInput>

        let rightButton =
            <TouchableOpacity
                onPress={() => {
                    this.rightButtonClick();
                }}
            >
                <Text style={styles.rightText}>{this.state.rightText}</Text>
            </TouchableOpacity>
        return (
            <View style={{
                height: 44,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: this.state.theme.themeColor
            }}>
                {leftButton}
                {inputView}
                {rightButton}
            </View>
        )
    }

    renderRow(projectModel) {
        return <RepositoryCell
            onSelect={() => ActionUtils.onSelect({
                projectModel: projectModel,
                flag: FLAG_STORAGE.flag_popular,
                projectModel: projectModel,
                ...this.params
            })}
            key={projectModel.item.id}
            projectModel={projectModel}
            theme={this.params.theme}
            onFavorite={(item, isFavorite) => ActionUtils.onFavorite(this.favoriteDao, item, isFavorite)}
        />

    }

    onSaveKey() {
        if (this.checkKeyIsExist(this.keys, this.searchText)) {
            this.toast.show(this.searchText + '标签已存在');
        } else {
            let key = {
                path: this.searchText,
                name: this.searchText,
                checked: true
            }
            // unshift()方法：将元素插入到数组最前面
            this.keys.unshift(key);
            this.languageDao.save(this.keys);
            this.toast.show(this.searchText + '标签已保存');
            this.keyChange = true;
        }
    }

    render() {

        let statusBar = null;
        if (Platform.OS === 'ios' && !DeviceInfo.isIPhoneX_deprecated) {// ios没有默认的statusBar，所以定义一个
            statusBar = <View style={{
                height: 20,
                backgroundColor: this.state.theme.themeColor
            }}/>
        }
        let listView = !this.state.isLoading ?
            <ListView
                dataSource={this.state.dataSource}
                renderRow={(data) => this.renderRow(data)}
            /> : null;

        let indicatorView = this.state.isLoading ? <ActivityIndicator
            style={styles.indicator}
            size='large'
            animating={this.state.isLoading}
        /> : null;

        let bottomButton = this.state.showBottomButton ? <TouchableOpacity
            style={[styles.bottomButton, this.state.theme.styles.navBar]}
            onPress={() => {
                this.onSaveKey();
            }}>

            <View>
                <Text style={styles.addFlag}>添加标签</Text>
            </View>

        </TouchableOpacity> : null;

        let resultView = <View style={{flex: 1}}>
            {indicatorView}
            {listView}
        </View>

        return <SafeAreaViewPlus
            topColor={this.state.theme.themeColor}
            bottomInset={true}
            style={GlobalStyles.root_container}>
            {statusBar}
            {this.renderNavBar()}
            {resultView}
            {bottomButton}
            <Toast ref={toast => this.toast = toast}/>
        </SafeAreaViewPlus>
    }

}

const styles = StyleSheet.create({
    textInput: {
        flex: 1,
        height: 30,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 3,
        color: 'white',
        paddingLeft: 10
    },
    rightText: {
        color: 'white',
        marginRight: 10,
        marginLeft: 10,
        fontSize: 16
    },
    indicator: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    addFlag: {
        fontSize: 18,
        color: 'white',
    },
    bottomButton: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        opacity: 0.9,
        position: 'absolute',
        top: GlobalStyles.window_height - 45 - (DeviceInfo.isIPhoneX_deprecated ? 34 : 0) - (Platform.OS === 'ios' ? 0 : 45),
        left: 10,
        right: 10,
        borderRadius: 3
    }
});