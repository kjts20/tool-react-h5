import { message, Modal, Button, ModalFuncProps } from 'antd';
import React, { ReactNode } from 'react';
import { isNum } from '@kjts20/tool';

/**
 * 简单确认框
 * @param content 消息体
 * @param config 其他配置
 * @returns
 */
export const simpleConfirm = function (content: ReactNode, config?: ModalFuncProps) {
    return new Promise((resolve, reject) => {
        const confirmConfig = config || {};
        const { onOk, onCancel } = confirmConfig;
        Modal.confirm({
            content,
            ...confirmConfig,
            onOk: (...args) => {
                onOk && onOk(...args);
                resolve(true);
            },
            onCancel: (...args) => {
                onCancel && onCancel(...args);
                reject();
            }
        });
    });
};

// 成功
export const success = function (msg: React.ReactNode, closeTime = 1500) {
    return new Promise(resolve => {
        message.success({
            content: msg,
            duration: (isNum(closeTime) ? closeTime : 1500) / 1000,
            afterClose() {
                resolve(true);
            }
        });
    });
};

// 失败
export const error = function (msg: React.ReactNode, err?) {
    console.warn('err=>', err);
    return new Promise(resolve => {
        message.error({
            content: msg,
            afterClose() {
                resolve(true);
            }
        });
    });
};

// 提示
export const tip = function (msg: React.ReactNode) {
    return new Promise(resolve => {
        message.warning({
            content: msg,
            afterClose() {
                resolve(true);
            }
        });
    });
};

// confirm
export const confirm = function (msg: React.ReactNode, okText = '确定', cancelText = '取消') {
    return new Promise((resolve, reject) => {
        Modal.confirm({
            content: msg,
            okText,
            cancelText,
            onOk() {
                resolve(true);
            },
            onCancel() {
                reject();
            }
        });
    });
};

// alert
export const alert = function (msg: React.ReactNode, okText = '知道了') {
    return new Promise(resolve => {
        Modal.info({
            content: msg,
            okText,
            onOk() {
                resolve(true);
            }
        });
    });
};

// loading
export const loading = function (closeTime = 5000, msg?: React.ReactNode, callback?: Function) {
    return message.loading({
        content: msg || '提交中',
        duration: (isNum(closeTime) ? closeTime : 0) / 1000,
        afterClose() {
            callback?.();
        }
    });
};
