import { Message, Dialog, Button } from '@alifd/next';
import React from 'react';
import { isNum } from '@kjts20/tool';

// 成功
export const success = function (msg: React.ReactNode, closeTime = 1500) {
    return new Promise(resolve => {
        Message.success({
            content: msg,
            duration: isNum(closeTime) ? closeTime : 1500,
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
        Message.error({
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
        Message.notice({
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
        const closeDialog = function (cb) {
            dialog?.hide();
            cb?.();
        };
        const dialog = Dialog.confirm({
            content: msg,
            footer: [
                <Button type="primary" onClick={() => closeDialog(resolve)} style={{ marginRight: 10 }}>
                    {okText || '确定'}
                </Button>,
                <Button onClick={() => closeDialog(reject)}>{cancelText || '取消'}</Button>
            ]
        });
    });
};
