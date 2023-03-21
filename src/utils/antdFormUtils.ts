import { isNum, isUndefined, toFunction } from '@kjts20/tool';
import { Rule } from 'rc-field-form/es/interface';

/**
 * antd 验证消息
 */
export const antdFormValidateMessages = {
    required: '${label}是必填项',
    types: {
        email: '${label}不合法邮箱',
        number: '${label}不合法数字'
    },
    number: {
        range: '${label}必须在${min}~${max}之间'
    }
};

// 变量名规则
export const varRe = /^[a-zA-Z_\$][a-zA-Z0-9_\$]*$/;
const enNameRe = /^[a-zA-Z_\$][a-zA-Z0-9_\$\-]*$/;

export const requiredRule = { required: true };

/**
 * 变量验证
 * @param val 验证的值
 * @returns
 */
export const varValidate = function (val, errPrefix = '') {
    return new Promise((resolve, reject) => {
        if (!varRe.test(val)) {
            return reject(new Error(errPrefix + '变量名不合法'));
        } else if (val.length > 32) {
            return reject(new Error(errPrefix + '变量名长度限制'));
        } else {
            return resolve(val);
        }
    });
};

/**
 * 英文名校验器
 * @param val 验证的值
 * @returns
 */
export const enNameValidate = function (val, errPrefix = '') {
    return new Promise((resolve, reject) => {
        if (!enNameRe.test(val)) {
            return reject(new Error(errPrefix + '命名不合法'));
        } else if (val.length > 32) {
            return reject(new Error(errPrefix + '命名长度限制'));
        } else {
            return resolve(val);
        }
    });
};

// 变量名校验器
export const varRule = function ({ getFieldValue }) {
    return {
        validator(_, val) {
            if (val) {
                return varValidate(val);
            } else {
                return Promise.resolve();
            }
        }
    };
};

// 英文名校验器
export const enNameRule = function ({ getFieldValue }) {
    return {
        validator(_, val) {
            if (val) {
                return enNameValidate(val);
            } else {
                return Promise.resolve();
            }
        }
    };
};

// 文件名规则
const fileNameRe = /^[a-zA-Z0-9_\-\@\.\+\$]+$/;
export const fileNameRule: Rule = function ({ getFieldValue }) {
    return {
        validator(_, val) {
            if (val) {
                if (!fileNameRe.test(val)) {
                    return Promise.reject(new Error('文件名不合法'));
                } else if (val.length > 32) {
                    return Promise.reject(new Error('文件名长度限制32个字符'));
                } else {
                    return Promise.resolve();
                }
            } else {
                return Promise.resolve();
            }
        }
    };
};

// 路径规则
export const directoryRule: Rule = function ({ getFieldValue }) {
    return {
        validator(_, val) {
            if (val) {
                for (const it of (val + '').split('/').filter(it => it)) {
                    if (!fileNameRe.test(it)) {
                        return Promise.reject(new Error('文件夹名称不合法'));
                    } else if (val.length > 128) {
                        return Promise.reject(new Error('文件夹名称过长'));
                    }
                }
                return Promise.resolve();
            } else {
                return Promise.resolve();
            }
        }
    };
};

// 名称校验器
export const titleRule: Rule = function ({ getFieldValue }) {
    return {
        validator(_, val) {
            if (val) {
                if (val.length > 32) {
                    return Promise.reject(new Error('名称长度限制'));
                } else {
                    return Promise.resolve();
                }
            } else {
                return Promise.resolve();
            }
        }
    };
};

// 数字校验器
export const numberRule: Rule = function ({ getFieldValue }) {
    return {
        validator(_, val) {
            if (val) {
                const num = Number(val);
                if (!isNum(num)) {
                    return Promise.reject(new Error('字段必须是数字类型'));
                } else {
                    return Promise.resolve();
                }
            } else {
                return Promise.resolve();
            }
        }
    };
};

// 生成最小值校验器
export const toMinRule = function (minVal): Rule {
    return function ({ getFieldValue }) {
        return {
            validator(_, val) {
                if (val) {
                    const num = Number(val);
                    if (isNum(num) && minVal > num) {
                        return Promise.reject(new Error('最小值是' + minVal));
                    } else {
                        return Promise.resolve();
                    }
                } else {
                    return Promise.resolve();
                }
            }
        };
    };
};
// 生成最大值校验器
export const toMaxRule = function (maxVal): Rule {
    return function ({ getFieldValue }) {
        return {
            validator(_, val) {
                if (val) {
                    const num = Number(val);
                    if (isNum(num) && maxVal < num) {
                        return Promise.reject(new Error('最大值是' + maxVal));
                    } else {
                        return Promise.resolve();
                    }
                } else {
                    return Promise.resolve();
                }
            }
        };
    };
};

// json校验器
export const jsonRule: Rule = function ({ getFieldValue }) {
    return {
        validator(_, val) {
            if (val) {
                try {
                    const jsonObj = JSON.parse(val);
                    if (jsonObj) {
                        return Promise.resolve();
                    } else {
                        return Promise.reject(new Error('JSON不合法'));
                    }
                } catch (error) {
                    return Promise.reject(new Error('JSON格式不正确'));
                }
            } else {
                return Promise.resolve();
            }
        }
    };
};

// 函数校验器
export const functionRule: Rule = function ({ getFieldValue }) {
    return {
        validator(_, val) {
            if (val) {
                try {
                    const func = toFunction(val);
                    if (func) {
                        return Promise.resolve();
                    } else {
                        return Promise.reject(new Error('函数语法错误'));
                    }
                } catch (error) {
                    return Promise.reject(new Error('语法错误：' + error.message));
                }
            } else {
                return Promise.resolve();
            }
        }
    };
};

// 值枚举的类型
export interface IValueEnum {
    title: string;
    value: string | number;
}
