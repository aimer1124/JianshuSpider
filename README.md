# 简书爬虫

>此功能纯粹为个人**意想**功能,利用业余时间来学习Node。

- 源代码
    
    - [https://github.com/aimer1124/JianshuSpider](https://github.com/aimer1124/JianshuSpider)

- 需求
    
    - [Teambition-简书爬虫](https://www.teambition.com/project/57a1802f767c4b360c918e49/tasks/scrum/57a1802f767c4b360c918e4c)

- 效果图

    - [HomePage](https://www.processon.com/view/link/57a1c693e4b0de6d056db518)
    - [Article](https://www.processon.com/view/link/57a2d0f1e4b0358f8ad7f03b)


- 启动

    - DB: `sudo mongod`
    
    - 程序: `gulp`
    
    - 测试: `gulp test`

- 引用包列表

    - express: [http://expressjs.com/](http://expressjs.com/),node web框架
        
        - body-parser: 请求数据体的转换`中间件`
        
        - cookie-parser: 请求头的`cookie`管理
        
        - debug: 调试工具
         
        - morgan: 日志中间件
        
        - serve-favicon: favicon中间件
         
    - async: [https://github.com/caolan/async](https://github.com/caolan/async),异步框架
    
    - cheerio: [https://github.com/cheeriojs/cheerio](https://github.com/cheeriojs/cheerio),加载`html`元素,并可使用`jQuery`进行操作
    
    - browser-sync: [http://browsersync.io](http://browsersync.io)浏览器数据同步框架
    
    - gulp: [http://gulpjs.com](http://gulpjs.com)构建工具
    
        - gulp-mocha:  运行`mocha`测试
        
        - gulp-nodemon: gulp的`nodemon`工具,用于`监控` node文件变化
        
    - highcharts: [http://www.highcharts.com](http://www.highcharts.com),图表控件
    
    - jade: [http://jade-lang.com/](http://jade-lang.com/)模板引擎
    
    - moment: [http://momentjs.com](http://momentjs.com),轻量级的时间转换库
    
    - mongoose: [http://mongoosejs.com/](http://mongoosejs.com/),`mongo`的对象模型工具
    
    - node-schedule: [https://github.com/node-schedule/node-schedule](https://github.com/node-schedule/node-schedule),Node的任务调度
    
    - should: [https://github.com/shouldjs/should.js](https://github.com/shouldjs/should.js), 断言库
    
    - superagent: [http://visionmedia.github.io/superagent/](http://visionmedia.github.io/superagent/),模拟客户端`HTTP`请求
    
    - supertest: [https://github.com/visionmedia/supertest](https://github.com/visionmedia/supertest), 将`superagent-HTTP`测试简单化

- 变更记录

    - [history](https://github.com/aimer1124/JianshuSpider/history.md)
    
- ShowCase

    - HomePage
    ![HomePage](http://7xq729.com1.z0.glb.clouddn.com/Blog/V0.0.3-Homepage.png)
    
    - ArticlePage
    ![Article](http://7xq729.com1.z0.glb.clouddn.com/Blog/V0.0.3-Article.png)
    
    - AuthorPage 
    ![Author](http://7xq729.com1.z0.glb.clouddn.com/Blog/V0.0.3-Author.png)

