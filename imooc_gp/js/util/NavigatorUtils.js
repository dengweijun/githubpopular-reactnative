import {NavigationActions} from 'react-navigation';

export default class NavigatorUtils {
    /**
     * 返回到上一页
     * @param navigation
     */
    static goBack(navigation) {
        navigation.goBack();
    }

    /**
     * 跳转到搜索页面
     * @param params
     */
    static goToSearchPage(params) {
        const {navigation, theme} = params;
        navigation.navigate('SearchPage',
            {
                navigation: navigation,
                theme: theme
            })
    }

    /**
     * 跳转到详情页
     */
    static goToRepositoryDetail(params) {
        const {navigation, projectModel, flag, theme, onUpdateFavorite} = params;
        navigation.navigate('RepositoryDetail',
            {
                navigation: navigation,
                projectModel: projectModel,
                flag: flag,
                theme: theme,
                onUpdateFavorite: onUpdateFavorite
            })
    }

    /**
     * 跳转到首页
     */
    static resetToHomePage(params) {
        const {navigation, theme, selectedTab} = params;
        const navigationAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({
                    routeName: 'HomePage',
                    params: {
                        theme: theme,
                        selectedTab: selectedTab
                    }
                })
            ]
        });
        navigation.dispatch(navigationAction);
    }

    /**
     * 跳转到菜单详情
     * @param params
     * @param routeName
     */
    static goToMenu(params, routeName) {
        const {navigation} = params;
        navigation.navigate(routeName, {
            ...params
        });
    }

}