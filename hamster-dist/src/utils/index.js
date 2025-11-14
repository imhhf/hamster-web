const u = navigator.userAgent;
const isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
const isApple = /iPhone|iPad|iPod|Macintosh|Mac OS X/i.test(u); //iphone终端

/**
 * 设置设备类型
 */
export function deviceType() {
  let type = "h5";
  if (isAndroid) {
    type = "android";
  } else if (isApple) {
    type = "ios";
  } else {
    type = "h5";
  }

  return type;
}

/**
 * 获取客户端传入语言参数
 */
export function getLang() {
  const urlObj = new URL(window.location.href);
  const params = new URLSearchParams(urlObj.search);
  const lang = params.get("lang");
  let flag = "ara"; //默认繁体中文

  if (lang) {
    if (lang.indexOf("en") > -1) {
      //英文
      flag = "en";
    } else {
      // 阿拉伯语
      flag = "ara";
    }
  }

  return flag;
}

/**
 * 复制
 * @target 复制的内容
 * @callback 回调函数
 */
export function copyTarget(target, callback) {
  var input = document.createElement("input"); // js创建一个input输入框
  input.value = target; // 将需要复制的文本赋值到创建的input输入框中
  document.body.appendChild(input); // 将输入框暂时创建到实例里面
  input.select(); // 选中输入框中的内容
  document.execCommand("Copy"); // 执行复制操作
  document.body.removeChild(input); // 最后删除实例中临时创建的input输入框，完成复制操作

  // 处理回调
  if (callback) {
    callback();
  }
}

export function getQueryString(name) {
  //正则表达式，获取地址中的参数
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);

  if (r != null) return unescape(r[2]);
  return null;
}

/**
 * 时区处理
 * @date 时间
 * @diff 时区差
 */
export function timeZoneHandler(date, diff) {
  // 获取本地时区与 UTC 时间之间的分钟差
  var offsetMinutes = date.getTimezoneOffset();

  // 将分钟差调整为 UTC + diff 时区的分钟差
  var targetOffset = offsetMinutes + diff * 60; // UTC + diff 时区的分钟差为本地时区分钟差加 diff * 60

  // 调整日期对象的小时数以转换为 UTC + diff 时区的时间
  date.setHours(date.getHours() + targetOffset / 60);

  return date;
}

/**
 * 分钟转小时
 * @minute 分钟数
 */
export function minuteToHour(minutes) {
  // 确保输入为整数
  const totalMinutes = Math.floor(minutes);

  // 计算小时数和剩余的分钟数
  const hours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  return `${hours}h${remainingMinutes}m`;

  // // 使用字符串填充函数来确保小时和分钟都是两位数
  // const formattedHours = String(hours).padStart(2, '0');
  // const formattedMinutes = String(remainingMinutes).padStart(2, '0');

  // // 格式化输出为 "xxhxxm"
  // return `${formattedHours}h${formattedMinutes}m`;
}

/**
 * 数组根据数组对象中的某个属性值进行排序
 * 使用例子：newArray.sort(sortBy('number',false)) //表示根据number属性降序排列;若第二个参数不传递，默认表示升序排序
 * @param attr 排序的属性 如number属性
 * @param rev true表示升序排列，false降序排序
 * */
export function sortBy(attr, rev) {
  //第二个参数没有传递 默认升序排列
  if (rev == undefined) {
    rev = 1;
  } else {
    rev = rev ? 1 : -1;
  }

  return function (a, b) {
    a = a[attr];
    b = b[attr];
    if (a < b) {
      return rev * -1;
    }
    if (a > b) {
      return rev * 1;
    }
    return 0;
  };
}

//使用递归的方式实现数组、对象的深拷贝
export function deepClone(obj) {
  //判断拷贝的要进行深拷贝的是数组还是对象，是数组的话进行数组拷贝，对象的话进行对象拷贝
  var objClone = Array.isArray(obj) ? [] : {};
  //进行深拷贝的不能为空，并且是对象或者是
  if (obj && typeof obj === "object") {
    for (k in obj) {
      if (obj.hasOwnProperty(k)) {
        if (obj[k] && typeof obj[k] === "object") {
          objClone[k] = deepClone(obj[k]);
        } else {
          objClone[k] = obj[k];
        }
      }
    }
  }
  return objClone;
}

/**
 * 格式化数值
 */
export function valFormat(value, fixedNum) {
  if (value > 9999) {
    value = value / 10000;
    if (fixedNum) {
      return (
        Math.round(value * Math.pow(10, fixedNum)) / Math.pow(10, fixedNum) +
        "W"
      );
    } else {
      return Math.round(value * Math.pow(10, 2)) / Math.pow(10, 2) + "W";
    }
  }
  return value;
}

/**
 * 判断是否是safari浏览器
 */
export function isSafari() {
  if (
    /Safari/.test(navigator.userAgent) &&
    !/Chrome/.test(navigator.userAgent)
  ) {
    return true;
  } else {
    return false;
  }
}
