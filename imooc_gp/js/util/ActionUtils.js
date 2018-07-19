import {FLAG_STORAGE} from '../expand/dao/DataRepository';
import NavigatorUtils from '../util/NavigatorUtils';

export default class ActionUtils {
    /**
     * 跳转到详情页
     * @param params 需要传递的一些参数
     */
    static onSelect(params) {
        NavigatorUtils.goToRepositoryDetail(params);
    }

    /**
     * 点击收藏图片的回调方法：将新的收藏数据保存到数据库中
     * @param item
     * @param isFavorite
     */
    static onFavorite(favoriteDao, item, isFavorite, flag) {
        let key = flag === FLAG_STORAGE.flag_trending ? item.fullName : item.id.toString();
        if (isFavorite) {
            favoriteDao.saveFavoriteItem(key, JSON.stringify(item));
        } else {
            favoriteDao.removeFavoriteItem(key);
        }
    }
}