import JsZip from 'jszip';
import FileSaver from 'file-saver';
import { generateRandomStr } from '@kjts20/tool';

// 文件格式
interface IFileDict {
    // 文件路径： 文件内容
    [filePath: string]: Blob | string;
}

/**
 * 生成zip并下载
 * @param fileContentDict 文件内容字典
 * @param downloadName
 * @returns
 */
export const toZipDownload = async function (fileContentDict: IFileDict, downloadName?: string) {
    // 文件名字
    const fileName = downloadName ? downloadName : `download-${generateRandomStr(5)}.zip`;
    // 创建压缩文件
    const zip = new JsZip();
    for (const fielPath in fileContentDict) {
        zip.file(fielPath, fileContentDict[fielPath]);
    }
    // 下载文件
    return await zip.generateAsync({ type: 'blob' }).then(content => {
        FileSaver.saveAs(content, fileName);
    });
};
