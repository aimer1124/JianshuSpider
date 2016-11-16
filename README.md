# 简书爬虫

>此功能纯粹为个人**意想**功能,利用业余时间来学习Node。`所有内容`均已`开源`,欢迎各种`PR`和`Fork`。

## 项目

- 源代码
    
    - [https://github.com/aimer1124/JianshuSpider](https://github.com/aimer1124/JianshuSpider)

- 需求
    
    - [Teambition-简书爬虫](https://www.teambition.com/project/57a1802f767c4b360c918e49/tasks/scrum/57a1802f767c4b360c918e4c)

- 效果图

    - [Home](https://www.processon.com/view/link/57a1c693e4b0de6d056db518)
    - [Article](https://www.processon.com/view/link/57a2d0f1e4b0358f8ad7f03b)
    - [Author](https://www.processon.com/diagraming/5819751de4b03a76e94bea6f)
    - [Collections](https://www.processon.com/diagraming/5819746ae4b06e7dcfc9b338)
    - [Search](https://www.processon.com/apps/58197ab8e4b03400d95e4c62)

- ShowCase

    - Home
    ![HomePage](http://7xq729.com1.z0.glb.clouddn.com/JianshuSpider/Home.png)
    
    - Articles
    ![Articles](http://7xq729.com1.z0.glb.clouddn.com/JianshuSpider/Articles.png)
    
    - Authors 
    ![Authors](http://7xq729.com1.z0.glb.clouddn.com/JianshuSpider/Authors.png)
    
    - Collections
    ![Collections](http://7xq729.com1.z0.glb.clouddn.com/JianshuSpider/Collections.png)
    
    - Search
    ![UnSearch](http://7xq729.com1.z0.glb.clouddn.com/JianshuSpider/UnSearch.png)
    <br>
    ![Search](http://7xq729.com1.z0.glb.clouddn.com/JianshuSpider/Search.png)
    
## 代码
    
- 启动

    - DB: `sudo mongod`
    
    - 程序: `gulp`
    
    - 测试: `gulp test`

- 版本
    
    - Node: 4.4.3
    
    - Mongo: 3.0.3

- 引用包列表
    
    - Backend
    
        - express: [http://expressjs.com/](http://expressjs.com/),node web框架
            
            - body-parser: 请求数据体的转换`中间件`
            
            - cookie-parser: 请求头的`cookie`管理
            
            - debug: 调试工具
             
            - morgan: 日志中间件
            
            - serve-favicon: favicon中间件
             
        - async: [https://github.com/caolan/async](https://github.com/caolan/async),异步框架
        
        - cheerio: [https://github.com/cheeriojs/cheerio](https://github.com/cheeriojs/cheerio),加载`html`元素,并可使用`jQuery`进行操作
    
        - moment: [http://momentjs.com](http://momentjs.com),轻量级的时间转换库
            
        - mongoose: [http://mongoosejs.com/](http://mongoosejs.com/),`mongo`的对象模型工具
        
        - node-schedule: [https://github.com/node-schedule/node-schedule](https://github.com/node-schedule/node-schedule),Node的任务调度
        
        - SuperAgent: [http://visionmedia.github.io/superagent/](http://visionmedia.github.io/superagent/),模拟客户端`HTTP`请求
        
        - sleep: [https://github.com/erikdubbelboer/node-sleep](https://github.com/erikdubbelboer/node-sleep), 添加`sleep`等待时间
        
    - FrontEnd
        
        - HighCharts: [http://www.highcharts.com](http://www.highcharts.com),图表控件
        
        - jade: [http://jade-lang.com/](http://jade-lang.com/)模板引擎
    
        - bootstrap: [http://getbootstrap.com/](http://getbootstrap.com/),前端样式处理
        
        - bootstrap-table: 基于[http://getbootstrap.com/](http://getbootstrap.com/)的Table处理[http://bootstrap-table.wenzhixin.net.cn/](http://bootstrap-table.wenzhixin.net.cn/)
        
        - bootstrap-select: 基于[http://getbootstrap.com/](http://getbootstrap.com/)的select处理[https://silviomoreto.github.io/bootstrap-select/](https://silviomoreto.github.io/bootstrap-select/)

    - Develop
    
        - browser-sync: [http://browsersync.io](http://browsersync.io)浏览器数据同步框架
    
        - gulp: [http://gulpjs.com](http://gulpjs.com)构建工具
    
            - gulp-mocha:  运行`mocha`测试
            
            - gulp-nodemon: gulp的`nodemon`工具,用于`监控` node文件变化
            
    - Test
     
        - should: [https://github.com/shouldjs/should.js](https://github.com/shouldjs/should.js), 断言库
    
        - SuperTest: [https://github.com/visionmedia/supertest](https://github.com/visionmedia/supertest), 将`superagent-HTTP`测试简单化
    
- 变更记录

    - [history](https://github.com/aimer1124/JianshuSpider/blob/master/history.md)
    
