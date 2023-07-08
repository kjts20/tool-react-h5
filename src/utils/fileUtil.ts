/*
 * @Author: wkj（wkj.kjwoo.cn）
 * @Date: 2023-07-08 12:07:38
 * @LastEditTime: 2023-07-08 13:38:54
 * @Description: 工具类：文件工具
 */
import pako from 'pako';
import { generateRandomStr, isObj, isStr } from '@kjts20/tool';
import FileSaver from 'file-saver';
import JSZip from 'jszip';

/**
 * 读取上传的文件
 * @param file 上传的文件
 * @returns
 */
export const readUploadFile = function (file: Blob) {
    return new Promise((resolve: (res: string) => void, reject) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            if (e && e.target) {
                resolve(e.target.result?.toString() + '');
            } else {
                reject(e);
            }
        };
        reader.onerror = function (e) {
            reject(e);
        };
        reader.readAsText(file);
    });
};

/**
 * 读取json文件
 * @param file 上传文件
 * @returns
 */
export const readUploadJsonFile = function <R = any>(file: Blob) {
    return new Promise((resolve: (res: R) => void, reject) => {
        readUploadFile(file)
            .then(res => {
                try {
                    resolve(JSON.parse(res));
                } catch (e) {
                    reject(e);
                }
            })
            .catch(e => {
                reject(e);
            });
    });
};

/**
 * 文件路径
 */
export interface IFilepath {
    // 路径字符串
    paths: string;
    // 名称
    name: string;
    // 扩展名
    ext: string;
    content: string;
}

export interface ITreeNode {
    key: string;
    title: string;
    children?: Array<ITreeNode>;
    isLeaf?: boolean;
}

export interface IFileAndTreeData<T> {
    fileDict: { [key: string]: T };
    treeNode: Array<ITreeNode>;
}

export const pathSeparator = '/';
/**
 * 文件内容转树形结构
 * @param fileData 文件内容列表
 * @returns
 */
export const fileData2TreeNode = function <T extends IFilepath>(fileData: Array<T>): IFileAndTreeData<T> {
    const fileTag = '__FILE__';
    const fileNameRe = new RegExp('^' + fileTag + '(.*?)$');
    const getFileName = fileName => (fileName + '').replace(fileNameRe, '$1');
    const dirTag = '__DIR__';
    const dirRe = new RegExp('^' + dirTag + '(.*?)$');
    const getDirName = dirName => (dirName + '').replace(dirRe, '$1');
    // 文件列表=>文件夹结构(字典模式)
    const dirData: any = {};
    for (const item of fileData) {
        const { paths, name, ext } = item;
        let useDict = dirData;
        for (const path of (paths + '').split(pathSeparator)) {
            const dirName = dirTag + path;
            if (!isObj(useDict[dirName])) {
                useDict[dirName] = {};
            }
            useDict = useDict[dirName];
        }
        useDict[fileTag + [name, ext].filter(it => it).join('.')] = { ...item, isLeaf: true };
    }
    // 根目录下文件处理(接在文件夹后面进行显示)
    const rootFile = dirData[dirTag];
    if (isObj(rootFile)) {
        delete dirData[dirTag];
        for (const fileName in rootFile) {
            dirData[fileName] = rootFile[fileName];
        }
    }
    // 构造树形结构
    const treeData: ITreeNode[] = [];
    const templateFileNameDict: { [fileName: string]: T } = {};
    function toTree(dirInfo, treeContainer: ITreeNode[], parents: Array<string> = []) {
        const fileArr: ITreeNode[] = [];
        for (const name in dirInfo) {
            const item: T = dirInfo[name];
            if (name.startsWith(fileTag)) {
                const title = getFileName(name);
                const fileName = [...parents, title].join('/');
                // 文件
                fileArr.push({
                    title,
                    key: fileName,
                    isLeaf: true
                });
                templateFileNameDict[fileName] = item;
            } else {
                // 文件夹
                const sourceDir = getDirName(name);
                const paths = [...parents, sourceDir];
                const dirTreeData: ITreeNode = {
                    title: sourceDir,
                    key: paths.join('/'),
                    children: []
                };
                treeContainer.push(dirTreeData);
                toTree(item, dirTreeData.children || [], paths);
            }
        }
        // 文件置后（文件夹后面）
        fileArr.forEach(file => treeContainer.push(file));
    }
    toTree(dirData, treeData);
    return {
        fileDict: templateFileNameDict,
        treeNode: treeData
    };
};

/**
 * 下载zip文件子项
 */
export interface IDownloadZipFileItem {
    // 路径字符串
    paths: string;
    // 名称
    name: string;
    // 扩展名
    ext: string;
    content: string;
}

/**
 * 下载zip文件
 * @param fileList 文件列表
 * @param zipName zip文件名字
 * @returns
 */
export const downloadZip = function <T extends IDownloadZipFileItem>(fileList: Array<T>, downloadName?) {
    const zipName = isStr(downloadName) ? downloadName : `download-${generateRandomStr(5)}`;
    return new Promise((resolve, reject) => {
        try {
            const zip = new JSZip();
            fileList.forEach(file => {
                const fileName = [file.name, file.ext].filter(it => it).join('.');
                zip.file([file.paths, fileName].filter(it => it).join(pathSeparator), file.content);
            });
            zip.generateAsync({ type: 'blob' })
                .then(content => {
                    FileSaver.saveAs(content, zipName + '.zip');
                    resolve({ msg: '下载成功' });
                })
                .catch(err => {
                    reject({
                        msg: err.message || '下载zip失败',
                        err
                    });
                });
        } catch (err) {
            reject({
                msg: err.message || '下载zip失败',
                err
            });
        }
    });
};

/**
 * 下载文件
 * @param downloadFileName 文件名字
 * @param fileContent 文件内容
 * @returns
 */
export const downloadFile = function (downloadFileName, fileContent) {
    return new Promise((resolve, reject) => {
        if (isStr(downloadFileName)) {
            try {
                FileSaver.saveAs(fileContent, downloadFileName);
                resolve({ msg: '下载成功' });
            } catch (err) {
                reject({
                    msg: err.message || '下载zip失败',
                    err
                });
            }
        } else {
            reject({
                msg: '下载文件名字为空',
                err: { downloadFileName }
            });
        }
    });
};

/**
 * arrayBuffer 转图片base64
 * @param buffer
 * @returns
 */
export const arrayBufferToBase64Img = function (buffer, imgExtension = 'jpeg') {
    const str = String.fromCharCode(...new Uint8Array(buffer));
    return `data:image/${imgExtension};base64,${btoa(str)}`;
};

/**
 * 转char数据
 * @param array
 * @returns
 */
const forCharData = function (array) {
    var res = '';
    var chunk = 8 * 1024;
    var i;
    for (i = 0; i < array.length / chunk; i++) {
        res += String.fromCharCode.apply(null, array.slice(i * chunk, (i + 1) * chunk));
    }
    res += String.fromCharCode.apply(null, array.slice(i * chunk));
    return res.replace(/%/g, '%25');
};

/**
 * gzip 解码
 * @param gzipStr
 * @returns
 */
export const unGzip = function (gzipStr) {
    try {
        var strData = atob(gzipStr);
    } catch (error) {
        console.error('解压错误： ', gzipStr);
        throw new Error('需要解压的字符型合法！！！');
    }
    var charData = strData.split('').map(function (x) {
        return x.charCodeAt(0);
    });
    var binData = new Uint8Array(charData);
    var data = pako.inflate(binData);
    //解决栈溢出问题
    strData = forCharData(new Uint16Array(data));
    var dateUrlDecode = decodeURIComponent(decodeURIComponent(strData));
    try {
        return JSON.parse(dateUrlDecode);
    } catch (e) {
        return dateUrlDecode;
    }
};

/**
 * gzip 编码
 * @param data
 * @returns
 */
export const gzip = function (data: object) {
    var binaryString = pako.gzip(encodeURIComponent(JSON.stringify(data)), { to: 'string' });
    return btoa(binaryString);
};

/**
 * base64转文件对象
 * @param base64Data
 * @returns
 */
export const base64ToBlob = function (base64Data) {
    var byteString;
    if (base64Data.split(',')[0].indexOf('base64') >= 0) {
        byteString = atob(base64Data.split(',')[1]);
    } else {
        byteString = unescape(base64Data.split(',')[1]);
    }
    var mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
};

/**
 * 获取文件base64编码
 * @param blob 读取文件base64的字节码文件
 */
export const getBase64 = function <File extends Blob>(file: File) {
    return new Promise((resolve: (res: string) => void, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};
