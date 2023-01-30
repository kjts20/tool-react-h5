/**
 * 请求响应过滤
 */
import { ResponseFilter } from '@kjts20/tool';
import { message } from 'antd';

export const resFilter = new ResponseFilter({
    error: (msg, err) => {
        message.error(msg + '');
        console.error('错误提示=>', err);
    }
});
