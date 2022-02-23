// vue-router/install.js
// install.js

import Link from './components/link';
import View from './components/view';

export let _Vue;

/**
 * 插件安装入口 install 逻辑
 * @param {*} Vue     Vue 的构造函数
 * @param {*} options 插件的选项
 */
export default function install(Vue, options) {
  _Vue = Vue;

  // 通过生命周期，为所有组件混入 router 属性
  Vue.mixin({
    beforeCreate() {
      if (this.$options.router) {
        // 根组件
        this._routerRoot = this;
        this._router = this.$options.router;
        this._router.init(this);

        // 目标：让 this._router.history.current 成为响应式数据；
        // 作用：current用于渲染时会进行依赖收集，当current更新时可以触发视图更新；
        // 方案：在根组件实例上定义响应式数据 _route，将this._router.history.current对象中的属性依次代理到 _route 上；
        // 优势：当current对象中的任何属性发生变化时，都会触发响应式更新；
        // Vue.util.defineReactive: Vue 构造函数中提供的工具方法,用于定义响应式数据
        Vue.util.defineReactive(this, "_route", this._router.history.current);
      } else {
        // 子组件
        this._routerRoot = this.$parent && this.$parent._routerRoot;
      }
    },
  });

  // 注册全局组件：router-link、router-view
  // 注册 Vue 全局组件
  Vue.component('router-link', Link);
  Vue.component('router-view', View);

  /**
   *  在 Vue 原型上添加 $route 属性 -> current 对象
   *  $route：包含了路由相关的属性
   */
  Object.defineProperty(Vue.prototype, "$route", {
    get() {
      // this指向当前实例；所有实例上都可以拿到_routerRoot；
      // 所以，this._routerRoot._route 就是根实例上的 _router
      // 即：处理根实例时，定义的响应式数据 -> this.current 对象
      return this._routerRoot._route; // 包含：path、matched等路由相关属性
    },
  });

  /**
   *  在 Vue 原型上添加 $router 属性 -> router 实例
   *  $router：包含了路由相关的方法
   */
  Object.defineProperty(Vue.prototype, "$router", {
    get() {
      // this._routerRoot._router 就是当前 router 实例；
      // router 实例中，包含 matcher、push、go、repace 等方法；
      return this._routerRoot._router;
    },
  });
}
