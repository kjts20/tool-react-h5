## 时时工具包-react 语言的 h5 专用

### 安装方式

```shell
npm install @kjts20/tool-react-h5
```

### 直接引入就即可使用

#### 请求类

```TS
import {httpServer} from "@kjts20/tool-react-h5";
// 修改host
httpServer.setHost("/");
// 发送get请求
httpServer.get("/url", {id: 5});
```
