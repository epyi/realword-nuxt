import { request } from '@/plugins/request'

// 用户登录
export const login = (data) => {
    return request({
        method: 'POST',
        url: '/api/users/login',
        data
    })
}

// 用户注册
export const register = (data) => {
    return request({
        method: 'POST',
        url: '/api/users',
        data
    })
}

// 修改用户信息
export const updateUserSet = (data) => {
    return request({
        method: 'PUT',
        url: '/api/user',
        data
    })
}

// 添加关注用户
export const addFollow = username => {
    return request({
        method: 'POST',
        url: `/api/profiles/${username}/follow`
    })
}

// 取消关注用户
export const deleteFollow = username => {
    return request({
        method: 'DELETE',
        url: `/api/profiles/${username}/follow`
    })
}