import { str_empty, str_space } from './string.const';

/**
 * 切割为字符串组
 * @param str
 * @param delimiter
 * @returns
 */
const strSplit = function (str, delimiter = str_space) {
    return ((str || str_empty) + str_empty).split(delimiter);
};

/**
 * 生成className
 * @param classNames 使用的class
 * @returns
 */
export const toClassName = function (...classNames) {
    let classNameArr: Array<string> = [];
    for (const className of classNames) {
        classNameArr = [...classNameArr, ...strSplit(className, str_space)];
    }
    return classNameArr.filter(it => it).join(str_space);
};
