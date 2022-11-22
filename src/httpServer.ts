import { HttpServer } from '@kjts20/tool';
import { axios2HttpServer } from './axios2httpServer';

export default new HttpServer({
    ...axios2HttpServer
});
