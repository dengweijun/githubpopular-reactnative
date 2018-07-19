package com.imooc_gp.ushare;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.text.TextUtils;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.Callback;
import com.imooc_gp.ushare.model.ShareModel;
import com.imooc_gp.ushare.util.Constants;
import com.umeng.socialize.ShareAction;
import com.umeng.socialize.UMShareAPI;
import com.umeng.socialize.UMShareListener;
import com.umeng.socialize.bean.SHARE_MEDIA;
import com.umeng.socialize.media.UMImage;

import java.lang.ref.WeakReference;

public class UShare {

    private static WeakReference<Activity> mActivity;
    private static WeakReference<ShareModel> mShareModel;

    // 初始化activity，将activity存为弱引用，方便资源销毁
    public static void init(Activity activity) {
        if (activity == null) return;
        mActivity = new WeakReference<>(activity);
    }

    public static void share(final String title, final String content, final String imageUrl,
                             final String targetUrl,
                             final Callback errorCallBack, final Callback successCallBack) {
        if (mActivity == null) return;
        boolean granted = true;
        // 图片需要sdcard读写权限，Android6.0以上需要手动申请权限
        if (!TextUtils.isEmpty(imageUrl)) {
            granted = ContextCompat.checkSelfPermission(mActivity.get(), Manifest.permission
                    .WRITE_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED;
        }
        if (!granted) {
            ShareModel shareModel = new ShareModel(title, content, imageUrl, targetUrl,
                    errorCallBack, successCallBack);
            mShareModel = new WeakReference<>(shareModel);
            // 请求打开权限
            ActivityCompat.requestPermissions(mActivity.get(), new String[]{Manifest.permission
                    .WRITE_EXTERNAL_STORAGE}, Constants.RC_PERMISSIONS);
            return;
        }
        // 主线程打开分享面板
        mActivity.get().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                openShare(title, content, imageUrl, targetUrl, errorCallBack, successCallBack);
            }
        });
    }

    private static void openShare(String title, String content, String imageUrl, final String
            targetUrl, final Callback errorCallBack, final Callback successCallBack) {
        ShareAction shareAction = new ShareAction(mActivity.get()).setDisplayList(SHARE_MEDIA
                .SINA, SHARE_MEDIA.QQ, SHARE_MEDIA.QZONE, SHARE_MEDIA.WEIXIN, SHARE_MEDIA
                .WEIXIN_CIRCLE, SHARE_MEDIA.WEIXIN_FAVORITE, SHARE_MEDIA.MORE)
                .withSubject(title).withText(content).withFollow(targetUrl).setCallback(new UMShareListener() {

                    @Override
                    public void onStart(SHARE_MEDIA share_media) {
                    }

                    @Override
                    public void onResult(SHARE_MEDIA share_media) {
                        if (share_media == SHARE_MEDIA.WEIXIN_FAVORITE) {
                            if (successCallBack != null) successCallBack.invoke("收藏成功啦");
                        } else {
                            if (successCallBack != null) successCallBack.invoke("分享成功啦");
                        }
                    }

                    @Override
                    public void onError(SHARE_MEDIA share_media, Throwable throwable) {
                        if (errorCallBack != null) errorCallBack.invoke("分享失败啦");
                        if (throwable != null) Log.d("throw", "onError: " + throwable.getMessage());
                    }

                    @Override
                    public void onCancel(SHARE_MEDIA share_media) {
                        if (errorCallBack != null) errorCallBack.invoke("分享取消啦");
                    }
                });
        if (!TextUtils.isEmpty(imageUrl)) {
            shareAction.withMedia(new UMImage(mActivity.get(), imageUrl));
        }
        shareAction.open();
    }

    public static void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (mActivity == null) return;
        UMShareAPI.get(mActivity.get()).onActivityResult(requestCode, resultCode, data);
    }

    public static void onRequestPermissionsResult(int requestCode, String[] permissions, int[]
            grantResults) {
        if (mShareModel == null) return;
        if (requestCode == Constants.RC_PERMISSIONS) {
            for (int i = 0, len = permissions.length; i < len; i++) {
                if (TextUtils.equals(permissions[i], Manifest.permission.WRITE_EXTERNAL_STORAGE)) {
                    if (grantResults[i] == PackageManager.PERMISSION_GRANTED) {
                        share(mShareModel.get());
                    } else {
                        Toast.makeText(mActivity.get(),
                                "没有使用SD卡的权限，请在权限管理中为GitHubPopular开启使用SD卡的权限",
                                Toast.LENGTH_LONG).show();
                    }
                }
            }
        }
    }

    private static void share(ShareModel shareModel) {
        share(shareModel.getTitle(), shareModel.getContent(), shareModel.getImageUrl(),
                shareModel.getImageUrl(), shareModel.getErrorCallBack(), shareModel
                        .getSuccessCallBack());
    }

}
