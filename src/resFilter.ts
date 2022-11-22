/**
 * 请求响应过滤
 */
import { ResponseFilter } from '@kjts20/tool';
import { Message } from '@alifd/next';

export const resFilter = new ResponseFilter({
    error: (msg, err) => {
        Message.error(msg + '');
        console.error('错误提示=>', err);
    }
});
