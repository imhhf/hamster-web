const u = navigator.userAgent; //浏览器用户代理
const isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
const isApple = /iPhone|iPad|iPod|Macintosh|Mac OS X/i.test(u); //iphone终端

// android桥方法
function androidBradgeFn(name, params) {
  if (!params) {
    return WebViewJavascriptBridge[name]();
  } else {
    return WebViewJavascriptBridge[name](params);
  }
}

// ios桥方法
function iosBradgeFn(name, params) {
  if (!params) {
    return window.webkit.messageHandlers[name].postMessage(null);
  } else {
    return window.webkit.messageHandlers[name].postMessage(params);
  }
}

/**
 * 打开用户资料页
 *  uid, // 用户id
 */
export function OpenUserSpace(uid) {
  if (isAndroid) {
    androidBradgeFn("openUserSpace", uid);
  }
  if (isApple) {
    iosBradgeFn("openUserSpace", uid);
  }
}

/**
 * 打开房间
 *  roomId, // 房间id
 */
export function OpenRoom(roomId) {
  if (isAndroid) {
    androidBradgeFn("openRoom", roomId);
  }
  if (isApple) {
    iosBradgeFn("openRoom", roomId);
  }
}

/**
 * 跳转去app金币充值页
 */
export function OpenCoinRecharge() {
  if (isAndroid) {
    androidBradgeFn("pay");
  }
  if (isApple) {
    iosBradgeFn("pay");
  }
}

// 获取ticket
export function OpengetToke() {
  if (isAndroid) {
    androidBradgeFn("getToken");
  }
  if (isApple) {
    iosBradgeFn("getToken");
  }
}

/**
 * 关闭webview
 */
export function AppClose() {
  if (isAndroid) {
    androidBradgeFn("close");
  }
  if (isApple) {
    iosBradgeFn("close");
  }
}

/**
 * 打开聊天
 *  uid, // 用户id
 */
export function AppOpenChat(uid) {
  if (isAndroid) {
    androidBradgeFn("openChat", uid);
  }
  if (isApple) {
    iosBradgeFn("openChat", uid);
  }
}

/**
 * 获取设别id
 * 客户端调用h5桥方法onDeviceIdResult方法回传deviceId
 */
export function GetDeviceId(cb) {
  window.onDeviceIdResult = function (e) {
    cb(e);
  };

  if (isAndroid) {
    androidBradgeFn("getDeviceId");
  }
  if (isApple) {
    iosBradgeFn("getDeviceId");
  }
}

/**
 * 唤起相册+上传图片，返回url
 * 客户端调用h5桥方法onImageChooserResult方法回传url
 */
export function ShowImageChooser(cb) {
  window.onImageChooserResult = function (e) {
    cb(e);
  };

  if (isAndroid) {
    androidBradgeFn("showImageChooser");
  }
  if (isApple) {
    iosBradgeFn("showImageChooser");
  }
}
