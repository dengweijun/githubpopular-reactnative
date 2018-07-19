# githubpopular-reactnative
my first reactnative app, so i know how to develop a reactnative app.

以下是自己RN项目，总结的一些笔记：
1.webstorm新建RN项目时，如果运行android无法正常安装项目，
则先用AS打开Android项目，自动build对应的gradle版本后，就可以正常运行安装了

2.可能需要用到的react-native第三方控件包（有部分控件需要link，具体操作上github上搜索）
npm i prop-types --save ： 安装prop-types，为了使用属性PropTypes
npm i react-native-deprecated-custom-components --save：Navigator
npm i react-native-tab-navigator --save：TabNavigator
npm i react-native-easy-toast --save：Toast
npm i react-native-scrollable-tab-view --save：ScrollableTabView, {ScrollableTabBar, DefaultTabBar}
npm i react-native-htmlview --save：HTMLView
npm i react-native-check-box --save：CheckBox
npm i react-native-parallax-scroll-view --save：ParallaxScrollView
npm i react-native-sortable-listview --save：SortableListView
npm i react-native-popup-dialog --save：dialog对话框
npm i react-native-image-picker --save：拍照/从相册中选择照片
npm i react-native-webview-bridge --save：js与webview之间的交互，（有很多bug没有得到解决）
npm i react-native-webview-invoke --save：js与webview之间的交互，（没有问题，可以使用）
npm i react-native-splash-screen --save：启动白屏，替换为app的全屏启动页


npm i react-native-imei --save：读取手机唯一IMEI码   
然后运行：react-native link react-native-imei，来自动配置
npm i react-native-device-info --save：读取设备信息，包括APP的versionCode和versionName信息
然后运行：react-native link react-native-device-info， 来自动配置


3.可能需要用到的公用控件和工具类
setup：启动之前的数据配置页面
DataRepository：网络请求数据（带缓存功能）
NavigationBar：订单标题栏和StatusBar
HttpUtils：封装post和get网络数据请求
ArrayUtils：数据工具类
Cancelable：可取消正在进行的网络请求
ViewUtils：获取通用的View，例如：标题栏的返回箭头getLeftButton()
GlobalStyles：全局通用的Styles



特别注意：如果升级第三方引入的包？
1. 在package.json文件中，删除引入包的这行代码，例如："react-native-check-box": "^2.1.0"
2. 再运行 npm i --save react-native-check-box，则会自动下载最新的包，并保存到package.json文件中
