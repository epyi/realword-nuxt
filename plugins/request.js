/**
 * 基于 axios 封装的请求模块
 */

import axios from 'axios'

// 创建请求对象
export const request = axios.create({
    baseURL: 'https://conduit.productionready.io'
})

// 通过插件机制 获取到上下文对象 ( query、params、req、res、app、store ...)
// 插件导出函数必须是默认导出
export default ({ store }) => {

    // 添加请求拦截器
    // 任何请求都要经过请求拦截器
    // 可以在请求拦截器中，做一些公共的业务处理，例如设置 token
    request.interceptors.request.use(function (config) {
        // 在发送请求之前做些什么
        const { user } = store.state

        if (user && user.token) {
            config.headers.Authorization = `Token ${user.token}`
        }

        Object.assign(config.headers, {'Content-Type': 'application/json; charset=utf-8'})
        return config;
    }, function (error) {
        // 对请求错误做些什么
        // 请求失败，且 请求没有发出去，进入这段代码
        return Promise.reject(error);
    });

    // 添加响应拦截器
    request.interceptors.response.use(function (response) {
        // 对响应数据做点什么
        return response;
    }, function (error) {
        // 对响应错误做点什么
        return Promise.reject(error);
    });
}