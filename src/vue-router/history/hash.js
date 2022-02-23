import { History } from "./base";
import {getHash} from '../util/getHash'


function ensureSlash() {
  // location.hash 存在兼容性问题，可根据完整 URL 判断是否包含'/'
  if (window.location.hash) {
    return;
  }
  window.location.hash = "/"; // 如果当前路径没有hash，默认为 /
}

class HashHistory extends History {
  constructor(router) {
    super(router);
    this.router = router;
    ensureSlash();
  }
  getCurrentLocation() {
    // 获取路径的 hash 值
    return getHash();
  }
  setupListener() {
    // 当 hash 值变化时，获取新的 hash 值，并进行匹配跳转
    window.addEventListener("hashchange", () => {
      this.transitionTo(getHash());
    });
  }
  push(location) {
    // 跳转路径，并在跳转完成后更新 hash 值；
    // transitionTo内部会查重：hash 值变化虽会再次跳转，但不会更新current属性;
    this.transitionTo(location, () => {
      window.location.hash = location; // 更新hash值
    });
  }
  // history/HashHistory.js

  /**
   * 路由跳转方法：
   *  每次跳转时都需要知道 from 和 to
   *  响应式数据：当路径变化时，视图刷新
   * @param {*}} location
   * @param {*} onComplete
   */
  transitionTo(location, onComplete) {
    // 根据路径进行路由匹配；route :当前匹配结果
    let route = this.router.match(location);
    // 查重：如果前后两次路径相同，且路由匹配的结果也相同，那么本次无需进行任何操作
    if (
      location == this.current.path &&
      route.matched.length == this.current.matched.length
    ) {
      // 防止重复跳转
      return;
    }
    // 使用当前路由route更新current，并执行其他回调
    this.updateRoute(route);
    onComplete && onComplete();
  }
}

export default HashHistory;
