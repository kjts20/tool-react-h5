import { HttpServer } from '@kjts20/tool';
import { axios2HttpServer } from './axios2httpServer';

export const httpServer = new HttpServer({
    ...axios2HttpServer
});
