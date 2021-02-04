import { request } from '@/plugins/request'

// 获取个人中心信息
export const getProfile = username => {
    return request({
        method: 'GET',
        url: `/api/profiles/${ username }`,
    })
}