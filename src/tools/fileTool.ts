/*
 * @Author: wkj（wkj.kjwoo.cn）
 * @Date: 2023-07-08 13:01:52
 * @LastEditTime: 2023-07-08 13:41:09
 * @Description: 文件工具
 */

import { isArr, isObj, strConst } from '@kjts20/tool';
import { downloadFile } from '../utils/fileUtil';

/**
 * CSV字段
 */
export interface ICsvColumn {
    title: string;
    column: string;
}

/**
 * 下载CSV文件
 * @param downloadFileName 文件名称
 * @param columnList 字段列表
 * @param dataSource 数据源
 * @returns
 */
export const downloadCsv = function (downloadFileName, columnList: Array<ICsvColumn>, dataSource: Array<any> = []) {
    const lineList: Array<string> = [];
    const toColumnVal = text => ((text === undefined || text === null ? '' : text) + '').replace(/\,/g, '","');
    // 表头制作
    lineList.push(columnList.map(it => toColumnVal(it.title)).join(strConst.COMMA));
    // 表内容制作
    for (const item of isArr(dataSource) ? dataSource : []) {
        if (isObj(item)) {
            const columnVals: Array<string> = [];
            for (const cIt of columnList) {
                columnVals.push(toColumnVal(item[cIt.column]));
            }
            lineList.push(columnVals.join(strConst.COMMA));
        }
    }
    const fileContent = new Blob([lineList.join(strConst.NEWLINE)], {
        type: 'application/vnd.ms-excel'
    });
    return downloadFile(downloadFileName, fileContent);
};

/**
 * 下载json文件
 * @param downloadFileName 文件名称
 * @param json json对象
 * @param spaceNum 空格数量
 * @returns
 */
export const downloadJson = function (downloadFileName, json: object, spaceNum = 4) {
    const fileContent = new Blob([JSON.stringify(json, null, spaceNum)], {
        type: 'application/json'
    });
    return downloadFile(downloadFileName, fileContent);
};

/**
 * 文件下载
 * @param content 字节码文件内容
 * @param fileName 下载名字
 * @return 下载文件的名字
 */
export const download = function (content: Blob, fileName: string) {
    (function (global) {
        let blob = new Blob([content]);
        //@ts-ignore
        const ieDownloader = global.navigator.msSaveBlob;
        if (typeof ieDownloader !== 'undefined') {
            ieDownloader(blob, fileName);
        } else {
            const downloadLink = document.createElement('a');
            downloadLink.download = fileName;
            downloadLink.style.display = 'none';
            downloadLink.href = URL.createObjectURL(blob);
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(downloadLink.href);
        }
    })(this || window || globalThis);

    return fileName;
};
