import { generateRandomStr, isObj, isStr } from '@kjts20/tool';
import { RcFile } from 'antd/lib/upload/interface';
import FileSaver from 'file-saver';
import JSZip from 'jszip';

/**
 * 读取上传的文件
 * @param file 上传的文件
 * @returns
 */
export const readUploadFile = function (file: RcFile) {
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
export const readUploadJsonFile = function <R = any>(file: RcFile) {
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
        if (isStr(downloadFile)) {
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
