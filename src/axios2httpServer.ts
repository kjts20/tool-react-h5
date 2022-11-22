/**
 * 使用axios转换为httpServer格式
 * 1、系统统一使用httpServer
 */
import { IHttpServerOptons, isObj } from '@kjts20/tool';
import Axios from 'axios';

export const axios2HttpServer: {
    request: IHttpServerOptons['request'];
    uploadFile: IHttpServerOptons['uploadFile'];
} = {
    // 请求类
    request(options) {
        const { url, data, header, timeout, method, success, error, complete } = options;
        Axios.request({
            url,
            data,
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
