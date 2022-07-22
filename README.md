# Crawler_ECNU
华东师范大学数据学院 web编程期末作业

- <a href="https://github.com/Ghostlikei/Crawler_ECNU/blob/main/log.md">开发过程</a>

- 环境需求

主机需要windows系统，js的版本在ES8及以上，以及以下一些需求库的安装，由于复用性需求，直接安装在全局变量当中，去掉-g也是可以的

```sh
npm install -g axios
npm install -g cheerio
```

Express框架的安装需要参考[官方教程](http://expressjs.com/en/starter/installing.html)

后续需要在前端里面安装的包直接安装在express文件当中

- 启动网页

本文档当中的$EXPRESS_PACKAGE_PATH = /src/web/sciencenews

```sh
cd /EXPRESS_PACKAGE_PATH
node bin/www
```

- 启动爬虫

需要手动修改数据库的连接，**一定要进到爬虫的文件夹里面再用node启动**，否则会找不到爬取的log

例子：

```sh
cd ./ScienceNet
node ./crawler.js
```

- mysql安装和配置

详情请看[官方文档](https://www.thewindowsclub.com/how-to-download-and-install-mysql-in-windows-10)，完成之后需要更改数据库的权限，直到在shell里面实现`mysql -u root -p`，在输入密码之后连接到服务端才算成功

src当中还有一些测试工具，全部在`Attempts`文件里面，ppt展示在src目录当中
