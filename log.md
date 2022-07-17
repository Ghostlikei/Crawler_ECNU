# 开发日志

用于记录项目开发过程，不代表最终结果

---

### 目标

开发一个新闻爬取项目，提供全文搜索，关键词时间热度分析

- 拟采用以下技术：
  - 使用HTML和JS实现前端搭建
  - 后端采用node.js进行控制
  - 由于技术限制，采用windows10作为平台开发
- 爬虫部分：
  - 尝试编写多线程爬虫，实现不了就暂时采用单线程
  - 对于每个网站的爬虫分别封装并进行单独控制，包括**异常控制流**，**时间间隔控制**，**启动/关闭控制**
  - 爬取的内容存储在数据库当中，考虑使用MySQL作为后端数据库
  - 对于爬取条目导出爬取日志，方便进行手动控制
  - 对于爬虫内部的参数分离控制，建立CONFIG.json进行调参
  - 建立一个后端的HTML对于前面的内容进行接口的封装，进行信息的整合
- 前端网页
  - 提供查询功能，关键词的时间热度分析图表，给出查询内容，能够返回一个有图表和新闻列表的网页
- 未完待续



### 7/15

- 体验编写单线程js爬虫

- 确定爬取的内容和网页，拟定垂直领域为**科学领域**
  - 科学网https://news.sciencenet.cn/topnews-2.aspx“要闻”全部条目全部爬取，预计75849条
  - 中国科学院网
    - 科研进展条目https://www.cas.cn/syky/index.shtml预计3000条
    - 每日科学条目https://www.cas.cn/kj/index.shtml预计3000条
  - ScienceNews，分topic，会有重复，预计27000条
    - chemistryhttps://www.sciencenews.org/topic/chemistry/page/2 预计900-1000条，尾页84
    - earth https://www.sciencenews.org/topic/earth/page/2 预计4000条，尾页299
    - humans https://www.sciencenews.org/topic/humans/page/2 预计8000条，尾页704
    - life https://www.sciencenews.org/topic/life/page/2 预计6000-7000条，尾页582
    - math https://www.sciencenews.org/topic/math/page/2 预计700-800条，尾页64
    - physics https://www.sciencenews.org/topic/physics/page/2 预计2000条，尾页188
    - science-society https://www.sciencenews.org/topic/science-society/page/2 预计1200条，103
    - space https://www.sciencenews.org/topic/space/page/2 预计3000条，尾页279
    - tech https://www.sciencenews.org/topic/tech/page/2 预计1200条，尾页106
  
  



### 7.16

- 编写爬虫，造轮子
- 构造一个包含以下方法的队列`queue`

enqueue,dequeue,front,end,isEmpty,toString,

### 7.17

- 编写爬虫，采用axios+cheerio实现异步爬虫

- 编写异步爬虫爬取科学网成功，共计61614条









