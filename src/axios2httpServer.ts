/**
 * 使用axios转换为httpServer格式
 * 1、系统统一使用httpServer
 */
import { IHttpServerOptons, isObj } from '@kjts20/tool';
import Axios from 'axios';

/**
 * 是否post表单请求
 * @param header 头部
 * @returns
 */
const isPostFormRequest = function (header) {
    const postContentTypeTag = 'x-www-form-urlencoded'.toUpperCase();
    for (const key in header || {}) {
        const uKey = key.toUpperCase();
        if (uKey === 'CONTENT-TYPE' || uKey === 'CONTENTTYPE') {
            const val = header[key];
            if ((val + '').toUpperCase().includes(postContentTypeTag)) {
                return true;
            }
        }
    }
    return false;
};

export const axios2HttpServer: {
    request: IHttpServerOptons['request'];
    uploadFile: IHttpServerOptons['uploadFile'];
} = {
    // 请求类
    request(options) {
        const { url, data, header, timeout, method, success, error, complete } = options;
        let requestParams = data;
        // 对post进行处理（axios只是支持url方式）
        if ((method + '').toUpperCase() === 'POST' && isPostFormRequest(header)) {
            let params = new URLSearchParams();
            for (const key in data || []) {
                params.append(key, data[key]);
            }
            requestParams = params;
        }
        Axios.request({
            url,
            data: requestParams,
            headers: header,
            timeout,
            method
        })
            .then(res => {
                if (isObj(res)) {
                    if (success) {
                        success({
                            ...res,
                            statusCode: res.status
                        });
                    }
                } else {
                    if (error) {
                        error(res);
                    }
                }
                if (complete) {
                    complete(res);
                }
            })
            .catch(err => {
                if (error) {
                    error(err);
                }
                if (complete) {
                    complete(err);
                }
            });
    },
    // 上传文件
    uploadFile(options) {
        const { url, filePath, formData, header, timeout, success, error, complete } = options;
        Axios.request({
            url,
            data: formData,
            headers: header,
            timeout,
            method: 'POST'
        })
            .then(res => {
                if (isObj(res)) {
                    if (success) {
                        success({
                            ...res,
                            statusCode: res.status
                        });
                    }
                } else {
                    if (error) {
                        error(res);
                    }
                }
                if (complete) {
                    complete(res);
                }
            })
            .catch(err => {
                if (error) {
                    error(err);
                }
                if (complete) {
                    complete(err);
                }
            });
    }
};
