import createRouteMap from "./create-route-map"
import { createRoute } from './history/base'

/**
 * 路由匹配器
 *  路由配置扁平化处理
 *  核心方法：addRoutes、match
 * @param {*} routes 
 * @returns 
 */
export default function createMatcher(routes) {

    let { pathMap } = createRouteMap(routes); //  路由配置扁平化处理

    function addRoutes(routes) {
        createRouteMap(routes, pathMap);
    }

    function match(location) {
        // 获取路由记录
        let record = pathMap[location]; // 一个路径可能有多个记录 
        // 匹配成功 
        if (record) {
            return createRoute(record, {
                path: location
            })
        }
        // 未匹配到 
        return createRoute(null, {
            path: location
        })
    }

    return {
        addRoutes, // 添加路由 
        match // 用于匹配路径
    }
}
