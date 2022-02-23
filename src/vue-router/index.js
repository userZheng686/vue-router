// index.js

import install from "./install";
import createMatcher from "./create-matcher"; // 导入匹配器
import HashHistory from "./history/hash";
import BrowserHistory from "./history/history";

// index.js

class VueRouter {
  constructor(options) {
    this.matcher = createMatcher(options.routes || []);
    options.mode = options.mode || "hash";
    switch (options.mode) {
      case "hash":
        this.history = new HashHistory(this);
        break;
      case "history":
        this.history = new BrowserHistory(this);
        break;
    }
  }
  // 监听 hash 值变化,跳转到对应的路径中

  init(app) {
    const history = this.history;
    const setUpListener = () => {
      history.setupListener();
    };
    history.transitionTo(history.getCurrentLocation(), setUpListener);
    // 每次路径变化时，都会调用此方法
    // 触发根实例 app 上响应式数据 _route 的更新
    history.listen((route) => {
      app._route = route;
    });
  }

  /**
   * 根据路径匹配到路由映射表 matcher 中进行路由匹配
   * 备注：VueRouter 类通过 match 方法对外提供 matcher 的访问，而不是直接访问 matcher
   * @param {*} location 路径
   * @returns 匹配结果数组
   */
  match(location) {
    // createMatcher.match
    return this.matcher.match(location);
  }

  push(to) {
    this.history.push(to); // 子类对应的push实现
  }
}
VueRouter.install = install;

export default VueRouter;
