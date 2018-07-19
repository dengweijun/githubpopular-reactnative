import {StackNavigator} from 'react-navigation';
import WelcomPage from '../pages/WelcomPage';
import HomePage from '../pages/HomePage';
import RepositoryDetail from '../pages/RepositoryDetail';
import SearchPage from '../pages/SearchPage';
import FavoritePage from '../pages/FavoritePage';
import WebViewPage from '../pages/WebViewPage';
import CustomKeyPage from '../pages/my/CustomKeyPage';
import CustomTheme from '../pages/my/CustomTheme';
import MyPage from '../pages/my/MyPage';
import SortKeyPage from '../pages/my/SortKeyPage';
import AboutMePage from '../pages/about/AboutMePage';
import AboutPage from '../pages/about/AboutPage';

export default AppNavigator = StackNavigator({
        WelcomPage: {
            screen: WelcomPage
        },
        HomePage: {
            screen: HomePage
        },
        RepositoryDetail: {
            screen: RepositoryDetail
        },
        SearchPage: {
            screen: SearchPage
        },
        FavoritePage: {
            screen: FavoritePage
        },
        WebViewPage: {
            screen: WebViewPage
        },
        CustomKeyPage: {
            screen: CustomKeyPage
        },
        CustomTheme: {
            screen: CustomTheme
        },
        MyPage: {
            screen: MyPage
        },
        SortKeyPage: {
            screen: SortKeyPage
        },
        AboutMePage: {
            screen: AboutMePage
        },
        AboutPage: {
            screen: AboutPage
        },
    }, {
        navigationOptions: {
            header: null
        }
    }
);