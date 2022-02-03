# Copha 模块服务器
Copha 内部模块注册，下载中心

# 部署模式
分为 API 模式和包管理模式
* API 模式

    提供模块信息，包版本信息 API 服务
* 包管理模式

    提供模块包上传和下载服务


# .env
- APP_KEY
- APP_SECRET

    用于模块 Token，用于模块上传验证
- GITHUB_TOKEN

    Github 数据仓库 Token
- APP_DB_SOURCE

    数据库来源,可以使用的值：local 和 remote
- DEPLOY_KEY

- PACKAGE_HUB

    是否以包存储服务模式启动，默认为空，可设置的值： 1
- APP_PUBLIC_PATH

    应用公用数据目录
- APP_PACKAGE_STORAGE_PATH

    存储包目录

### API
- 访问点 https://hub.copha.net/api/v1

#### Module API

- GET /modules
  模块列表

- GET /modules/id
  获取模块信息

- PUT /modules/id
  更新模块信息

#### Package API

- GET /package_hosts
  获取模块包上传节点

- GET /modules/id/packages
  获取模块包列表

- POST /modules/id/packages
  创建新版本包


