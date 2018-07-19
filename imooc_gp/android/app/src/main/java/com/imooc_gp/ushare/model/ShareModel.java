package com.imooc_gp.ushare.model;

import com.facebook.react.bridge.Callback;

public class ShareModel {
    private String title;// 标题
    private String content;// 内容
    private String imageUrl;// 图片
    private String targetUrl;// 链接地址
    private Callback errorCallBack;// 分享失败回调
    private Callback successCallBack;// 分享成功回调

    public ShareModel(String title, String content, String imageUrl, String targetUrl, Callback
            errorCallBack, Callback successCallBack) {
        this.title = title;
        this.content = content;
        this.imageUrl = imageUrl;
        this.targetUrl = targetUrl;
        this.errorCallBack = errorCallBack;
        this.successCallBack = successCallBack;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getTargetUrl() {
        return targetUrl;
    }

    public void setTargetUrl(String targetUrl) {
        this.targetUrl = targetUrl;
    }

    public Callback getErrorCallBack() {
        return errorCallBack;
    }

    public void setErrorCallBack(Callback errorCallBack) {
        this.errorCallBack = errorCallBack;
    }

    public Callback getSuccessCallBack() {
        return successCallBack;
    }

    public void setSuccessCallBack(Callback successCallBack) {
        this.successCallBack = successCallBack;
    }
}
