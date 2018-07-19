/**
 * 全局样式
 */
import {
    Dimensions
} from 'react-native';

const {height, width} = Dimensions.get('window');
module.exports = {
    // 灰色横线
    line: {
        height: 0.5,
        opacity: 0.5,
        backgroundColor: '#dddddd'
    },
    root_container: {
        flex: 1,
        backgroundColor: '#f3f3f4'
    },
    window_height: height,
    window_width: width,
    nav_bar_height_ios:44,
    nav_bar_height_android:50,
}

