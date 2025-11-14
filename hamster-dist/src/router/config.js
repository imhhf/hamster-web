/**
 * @param {String} param1 需要遍历的目录路径
 * @return {Object} 返回一个key为文件相对路径，value为对应文件模块导出的内容的对象集合
 */
const moduleFiles = import.meta.globEager('./modules/*.js');

// 通过 reduce 去搜集所有的模块的导出内容
const router_modules = Object.keys(moduleFiles).reduce((routes, filepath) => {
    // 因为moduleFiles是一个函数，那么可以接受一个参数（string：文件的相对路径），调用其从而获取到对应路径下的模块的导出对象
    // 导出的对象中有一个属性：default，可以获取到默认导出的所有内容
    const value = moduleFiles[filepath].default;

    // 我们判断导出的是不是数组，是则进行拓展解构
    if (Array.isArray(value)) {
        routes.push(...value);
    } else {
        // 否则直接加到routes中
        routes.push(value);
    }
    
    return routes;
}, []);

// 直接导出所有模块配置的路由
export default router_modules;