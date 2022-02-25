# Copha 模块服务器
Copha 内部模块注册，下载服务源码

## 部署模式
有两种部署模式，分为 API 模式和包管理模式
* API 模式

  提供模块信息，包版本信息，包存储节点信息等 API 服务
* 包管理模式

  提供模块包上传和下载服务


## .env 文件配置说明
- APP_KEY
- APP_SECRET

    用来生成模块 Token，模块管理凭证
- GITHUB_TOKEN

    Github 数据仓库 Token
- APP_DB_SOURCE

    数据库来源,可以使用的值：local 和 remote

- PACKAGE_HUB

    设置值为 1 将以包存储服务模式启动，默认启动模式为 API 模式
- APP_PUBLIC_PATH

    应用公开数据目录，默认为 *APP_ROOT/public*
- APP_PACKAGE_STORAGE_PATH

    存储包目录，默认为 *APP_PUBLIC_PATH/packages*

## API 说明
- Copha 模块管理地址域名 [`hub.copha.net`](https://hub.copha.net)

- 接入访问点 https://hub.copha.net/api/v1
### Module API
- GET /modules

  模块列表

- GET /modules/id

  获取模块详细信息

- PUT /modules/id

  更新模块信息
### Package Host API
- GET /package_hosts

  获取模块包上传节点信息

  > 上传模块包无需手动指定 package host，通常在模块信息里已经指定了该模块对应使用的 package host

### Package API
- GET /modules/id/packages

  获取模块包列表

- POST /modules/id/packages

  创建新版本包

## API 测试

```js
npm test
```



