/*
 * @Author: wkj
 * @Date: 2022-04-21 18:05:58
 * @Description: antd文件文件上传
 */
import { QueueManager } from '@kjts20/tool';
import { UploadRequestOption as RcCustomRequestOptions, UploadRequestError } from 'rc-upload/lib/interface';
import { httpServer } from './httpServer';
const api = {
    commonUploadImg: '/common/file/img/upload',
    commonUploadFile: '/common/file/file/upload'
};
// 消费频道
enum EQueueChannel {
    IMG = 'IMG',
    TEXT = 'TEXT',
    ALL = 'ALL'
}

// 注册一个antd文件上传队列管理器，并添加一个监听者
const antdUploaderManager = new QueueManager();

// 添加一个图片上传消费者
antdUploaderManager.addConsumer({
    options: {
        channel: EQueueChannel.ALL
    },
    callback: function (presetOptions, options) {
        if (!presetOptions || !presetOptions.target) {
            return console.log('目标地址不存在，无法上传', presetOptions, options);
        } else {
            const { data, onProgress, onError, onSuccess, file, filename } = options;
            const { target } = presetOptions;
            // 定义错误方法
            const reject = (err: UploadRequestError) => {
                if (onError) {
                    onError(err);
                } else {
                    console.error('上传文件为空', options);
                }
            };
            if (filename) {
                const sendData = { ...(data || {}) };
                sendData[filename] = file;
                // 调用上传函数
                httpServer
                    .file(target, sendData, {
                        onUploadProgress: e => {
                            const { total, loaded } = e;
                            if (onProgress) {
                                onProgress({
                                    percent: (loaded / total) * 100
                                });
                            }
                        }
                    })
                    .then(res => {
                        if (res.success) {
                            if (onSuccess) {
                                onSuccess(res.data);
                            } else {
                                console.info('上传成功，但是没有指定成功回调方法', res);
                            }
                        } else {
                            reject({
                                name: '上传错误',
                                message: res.msg
                            });
                        }
                    })
                    .catch(err => {
                        reject({
                            name: '上传错误',
                            message: err.msg,
                            stack: err.data
                        });
                    });
            } else {
                reject({
                    name: '上传错误',
                    message: '上传文件为空'
                });
            }
        }
    }
});

// 上传间隔为500ms
antdUploaderManager.start(500);

// 自定义antd图片上传者
export const antdImgUploader = function (options: RcCustomRequestOptions) {
    antdUploaderManager.push(
        {
            channel: EQueueChannel.ALL,
            target: api.commonUploadImg
        },
        options
    );
};

// 自定义antd文件上传者
export const antdFileUploader = function (options: RcCustomRequestOptions) {
    antdUploaderManager.push(
        {
            channel: EQueueChannel.ALL,
            target: api.commonUploadFile
        },
        options
    );
};
