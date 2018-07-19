package com.imooc_gp.ushare;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class UShareModule extends ReactContextBaseJavaModule {
    public UShareModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "UShare";
    }

    @ReactMethod
    public static void share(String title, String content, String imageUrl, String targetUrl,
                             Callback errorCallBack, Callback successCallBack) {
        UShare.share(title, content, imageUrl, targetUrl, errorCallBack, successCallBack);
    }
}
