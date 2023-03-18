/**
 * 请求响应过滤
 */
import { ResponseFilter } from '@kjts20/tool';
import { error } from './platform';

export const resFilter = new ResponseFilter({
    error: (msg, err) => {
        error(msg, err);
    }
});
