## 时时工具包-react 语言的 h5 专用

### 安装方式

```shell
npm install @kjts20/tool-react-h5
```

### 直接引入就即可使用

#### 使用方面

```typescript
import { axios2HttpServer, localStorageImpl, sessionStorageImpl } from '@kjts20/tool-react-h5';
import { CommonStorage, HttpServer, ResponseFilter } from '@kjts20/tool';
const httpServer = new HttpServer({
    ...axios2HttpServer,
    host,
    apiPrefix: mapiPrefix,
    setHeader() {
        return {
            token: getToken()
        };
    },
    responseIntercept(response) {
        if (response.code === 308) {
            MessagePlugin.warning('登录过期，请先登录！');
            loginOut();
            throw new Error('未登录！');
        } else {
            return response;
        }
    }
});

export const storage = new CommonStorage(sessionStorageImpl);

export const storageLocaltion = new CommonStorage(localStorageImpl);
```

```typescript
// 平台兼容
import { platformPolyfill } from '@kjts20/tool';
platformPolyfill();
```

```typescript
import { downloadJson, downloadCsv} from '@kjts20/tool-react-h5';
// 下载json文件
const jsonData = [
    { title: 'ID,', column: 'id' },
    { title: "标题'", column: 'title' },
    { title: '描述"', column: 'description' }
];
downloadJson('test.json',jsonData);

// 下载csv
const csvHeaderList = [
    { title: 'ID,', column: 'id' },
    { title: "标题'", column: 'title' },
    { title: '描述"', column: 'description' }
];
const csvBody = [
    {id: 1,  title: '测试11,等待的', description: '双引号"测试' }
    {id: 2,  title: '测试222,等待的', description: '双引号"测试' }
];
downloadCsv('test.csv',csvHeaderList, csvBody);
```
