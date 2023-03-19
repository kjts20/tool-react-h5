import { ISetStorageOptions, IGetStorageOptions, IRemoveStorageOptions, IClearStorageOptions, IStorageApi, isFunc } from '@kjts20/tool';

// 保存json的key
const saveJsonKey = function (key: number | string) {
    return key + '-kjts20-json';
};

/**
 * 生成仓库实现类
 * @param storage 仓库
 * @returns
 */
const toStorageImpl = function (storage: Storage): IStorageApi {
    // 获取storage
    const getStorage = function (key) {
        const getVal = k => storage.getItem(k);
        let val = getVal(saveJsonKey(key));
        if (typeof val === 'string') {
            return JSON.parse(val);
        } else {
            return getVal(key);
        }
    };
    return {
        setStorage(options: ISetStorageOptions) {
            const { key, data, success, fail } = options;
            try {
                storage.setItem(saveJsonKey(key), JSON.stringify(data));
                isFunc(success) && success({ errMsg: 'setStorage:ok', err: null });
                return true;
            } catch (err) {
                isFunc(fail) && fail({ errMsg: '保存错误', err });
                return false;
            }
        },
        setStorageSync(key: number | string, data) {
            try {
                storage.setItem(saveJsonKey(key), JSON.stringify(data));
                return true;
            } catch (err) {
                console.warn('保存sessionStorage错误', err);
                return false;
            }
        },
        getStorage(options: IGetStorageOptions) {
            const { key, success, fail } = options;
            try {
                const data = getStorage(key);
                isFunc(success) && success({ data });
                return true;
            } catch (err) {
                isFunc(fail) && fail({ errMsg: '获取值错误', err });
                return false;
            }
        },
        getStorageSync(key: number | string) {
            try {
                return getStorage(key);
            } catch (err) {
                console.warn('获取sessionStorage错误', err);
                return undefined;
            }
        },
        removeStorage(options: IRemoveStorageOptions) {
            const { key, success, fail } = options;
            try {
                storage.removeItem(saveJsonKey(key));
                storage.removeItem(key + '');
                isFunc(success) && success({ errMsg: 'removeStorage:ok' });
                return true;
            } catch (err) {
                isFunc(fail) && fail({ errMsg: '获取值错误', err });
                return false;
            }
        },
        clearStorage(options: IClearStorageOptions) {
            const { success, fail } = options;
            try {
                storage.clear();
                isFunc(success) && success({ errMsg: 'clearStorage:ok' });
                return true;
            } catch (err) {
                isFunc(fail) && fail({ errMsg: '获取值错误', err });
                return false;
            }
        }
    };
};

/**
 * localStorage实现
 */
export const localStorageImpl = toStorageImpl(localStorage);

/**
 * sessionStorage实现
 */
export const sessionStorageImpl = toStorageImpl(sessionStorage);
