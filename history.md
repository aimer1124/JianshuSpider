
>每次修改时的变更记录。

## **20161019**

- 完善搜索结果,在没有找到结果时,提示信息,并隐藏数据表格显示

- 重构`用户`数据展示模板,添加`userList.jade`

- 优化搜索后,返回搜索`类型`及`搜索内容`

```
select(name='searchType')
    option(value='article', selected= searchType == 'article') 文章
    option(value='author', selected= searchType == 'author') 作者
```


- 添加用户搜索的测试

## **20161018**
- 设置在未输入`搜索`内容时,搜索框内容为空

    - 设置`搜索`输入框的`placeholder`
    
```
if result == null
    input(name='searchContent', value='', placeholder='请输入搜索内容')
else
    input(name='searchContent', value='#{searchContent}')
```

- 添加搜索测试内容
    
    - 默认页面
    
    ```
    if ($("input").toArray().length < 1) throw new Error('There is not input_text!');
    if (!$("button")) throw new Error('There is not search_button!');
    ```
        
    - 搜索结果
    ```
    request.post('/search')
        .send({'searchContent': '1'})
        .expect(200)
        .expect(function (res) {
            var $ = cheerio.load(res.text);
            if ($("#article tbody tr td").eq(0).text().length < 1) {
                throw new Error("article title must exist.");
            }
        })
        .end(done);
    ```

- 提取文章内容展示公式模板文件`articleList.jade`

- 添加`搜索`类型的`下拉列表`选项

```
select(name='searchType')
    option(value='article') 文章
    option(value='author') 作者
```

## **20161014**

- 添加搜索文章功能,支持搜索结束后,将`搜索内容`回显给输入框

    - 使用`form`表单提交搜索内容,`search.jade`
    
    ```
    form(action='/search', method='post')
        input(name='searchContent')
        button(type='submit') 搜索
    ```
        
    - 模糊查询标题名,`proxy/article.js`
    
    ```
    exports.findByTitle = function (articleTitle, callback) {
        var findContent = { 'title': { $regex:  articleTitle}};
        article.find(findContent, callback);
    };

    ```
    

## **20161011**

- 修改`个人数据`获取时,若数据已存在,则更新数据

```
exports.updateInfo = function (today, following, follower, callback) {
    myInfo.update({date: today}, {following: following, follower: follower}, callback);
};
```

- 提取页面头部`header`为公式的`jade`文件,使用`include`调用

    - [block VS include](http://stackoverflow.com/questions/14170537/difference-between-include-and-block-in-jade)

- 发布Release: `V0.0.3`
    

## **20161010**

- 添加`作者`页面: 默认展示`粉丝量`最高的前20位作者

    - 添加测试代码`test/user-spec.js`
    
    - 作者页面中,作者名支持可点击至`简书`官网作者的个人信息页面

- 若`作者`数据已存在,则更新`作者`的`关注量`和`粉丝量`

    - `proxy/user.js`
    ```
    exports.updateUser = function (article, following, follower, callback) {
        user.update({id: article.authorHref}, {following: following, follower: follower},callback)
    };
    ```    
    
    - `util/syncData.js`
    ```
    userProxy.getUserById(article.authorHref,function (err, findAuthor) {
        if (findAuthor.length == 0) {
            userProxy.saveUser(article, following, follower, function (err) {
                if (err) return next(err);
            });
        } else {
            userProxy.updateUser(article, following, follower,function (err) {
                if (err) return next(err);
            })
        }
    });
    ```
    
## **20161009**

- 将`变更记录`提取为单独的文件`history.md`

- 将测试内容更加精细化: `数据内容`及`表格内容数量`

- 重构`获取个人信息`和`个人文章`内容

- 提取数据库公共链接配制`model/config.js`

```
module.exports = {
    dbUrl: "localhost/jianshu"
};
```

## **20161008**

- 引用[Highcharts](http://www.highcharts.com/)图表控件:
```
"highcharts": "^5.0.0"
```


    - 配制假数据,前端可使用`highcharts`控件来显示数据
        - `layout.jade`中添加`highcharts`引用
        
        ```
          head
            title 简书爬虫
            link(rel='stylesheet', href='/stylesheets/style.css')
            script(type='text/javascript', src="http://code.jquery.com/jquery-1.9.1.min.js")
            script(type='text/javascript', src="http://code.highcharts.com/highcharts.js")
            script(type='text/javascript', src="http://code.highcharts.com/modules/exporting.js")
        ```
    
        - `index.jade`中添加静态数据展示
        
        ```
        div#container(style="min-width: 500px; height: 500px; margin: 0 auto")
          script.
            $(function () {
              $('#container').highcharts({
                title: {
                  text: '个人信息时势图',
                  x: -20 //center
                },
                subtitle: {
                  text: '数据来源: jianshu.com',
                  x: -20
                },
                xAxis: {
                  categories: ['2016-09-22', '2016-09-26', '2016-09-27', '2016-09-28', '2016-09-29', '2016-09-30', '2016-10-08']
                },
                yAxis: {
                  title: {
                    text: '人数'
                  },
                  plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                  }]
                },
                tooltip: {
                  valueSuffix: '人'
                },
                legend: {
                  layout: 'vertical',
                  align: 'right',
                  verticalAlign: 'middle',
                  borderWidth: 0
                },
                series: [{
                  name: '关注',
                  data: [28, 28, 28, 29, 29, 29, 28]
                }, {
                  name: '粉丝',
                  data: [69, 73, 78, 92, 95, 95, 97]
                }]
              });
            });
        ```
     
- 使用真数据替换

    - 将获取的`三组`数据进行打包, 通过`render`传递给`jade`模块, 此时需要使用`sort`方法, 否则会被默认重新排序
    
    ```
    res.render('index', {info: myInfo, myArticle: myArticle, followerList: followerList.sort(), followingList: followingList.sort(), dateList: dateList.sort()});
    ```
    
    - 由于时间格式原来采用`2016-09-30`,在`node`获取时,会自动进行计算。因此将获取过来的数据进行格式转化: `20160930`
    
    ```
    dateList.push(info.date.replace(/-/g,''));
    ```

    - 完整前端`index.jade`代码
    
    ```
    div#container(style="min-width: 500px; height: 500px; margin: 0 auto")
      script.
        var arrToMultiArr = function (arr) {
          var result = new Array()
          for (var i = 0; i < arr.length; i++) {
            var date = arr[i]
            result.push([date])
          }
          return result
        };
        var followerList = arrToMultiArr([#{followerList}]);
        var followingList = arrToMultiArr([#{followingList}]);
        var dateList = arrToMultiArr([#{dateList}]);
    
        $(function () {
          $('#container').highcharts({
            title: {
              text: '个人信息时势图',
              x: -20 //center
            },
            subtitle: {
              text: '数据来源: jianshu.com',
              x: -20
            },
            xAxis: {
              categories: dateList
              //categories: ['2016-09-22', '2016-09-26', '2016-09-27', '2016-09-28', '2016-09-29', '2016-09-30', '2016-10-08']
            },
            yAxis: {
              title: {
                text: '人数'
              },
              plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
              }]
            },
            tooltip: {
              valueSuffix: '人'
            },
            legend: {
              layout: 'vertical',
              align: 'right',
              verticalAlign: 'middle',
              borderWidth: 0
            },
            series: [{
              name: '关注',
              data: followingList
            }, {
              name: '粉丝',
              data: followerList
            }]
          });
        });
    ```

- 样式调整
    
    - 将个人数据及图表放在同一行,文章列表放在下一行
    
    - 所有表格数据内容均采用`局中`对齐,文件标题采用`左对齐`
    
- 格式化所有`jade`代码: 缩进调整

## **20160930**

- 发布`V0.0.2`版本

- 完善测试,添加内容验证: 首页/文章列表

```
if ($("#myInfo tbody tr td").eq(0).text().indexOf("2016")) throw new Error("MyInfo date is lost, because date is not 201*Year");
if ($("#article tbody tr td").toArray().length == 7) throw new Error("There is not 7 information.");

if ($("#myArticle tbody tr td").eq(1).text().indexOf("2016")) throw new Error("MyArticle is lost, because publish-date is not 201*Year");

```


## **20160928**

- 修复: 获取文章数据时，会同时插入一条空数据

    - 将`mongoose`的`model`的字段类型做限制,否则会在`每次`插入数据时,均会有一条空值(仅有`_id`和`__v`)插入。参考[Why does Mongoose add blank arrays?](http://stackoverflow.com/questions/12658152/why-does-mongoose-add-blank-arrays)
    ```
    var articleScheme = new Schema({
        title: {type:String, required:true},
        articleHref: {type:String, required:true},
        author: {type:String, required:true},
        authorHref: {type:String, required:true}
    });
    ```

- 调整`myInfo` `author`的`model`添加字段约束

- 完善测试`首页`的验证内容
    
    - 添加对`个人信息`中首个数据的年份验证
    
    - 添加对`自己文章`中首个数据的发布时间年份验证
```
if ($("#myInfo tbody tr td").eq(0).text().indexOf("2016")) throw new Error("MyInfo date is lost, because date is not 201*Year");
if ($("#myArticle tbody tr td").eq(1).text().indexOf("2016")) throw new Error("MyArticle is lost, because publish-date is not 201*Year");
```

## **20160927**

- 个人信息中的排序修改为`倒序`

    - 修改`myInfoSchema.find({},cb)`方法为`myInfoSchema.find({}).sort(date:-1).exec(cb)`

- 修改个人信息中数据仅显示前`7`条
    
    - 调整`myInfoSchema.find({}).sort(date:-1).exec(cb)`添加`limit(7)`限制

- 修改文章列表仅显示最新的20条
    
    - 修改`getAllArticles`方法,排序按`_id`号排序
    ```
    exports.getAllArticles = function (callback) {
        article.find({}).limit(20).sort({ _id: -1}).exec(callback);
    };
    ```

## **20160921**

- 时间处理方式统一

    - 调整时间处理格式使用[moment](http://momentjs.com/)模块处理
    
    - 修复旧数据中时间格式统一将原数据格式调整为: `db.myinfos.update({'date':'Fri Aug 05 2016'},{$set:{'date':'2016-08-05'}})`

- 调整首页中获取简书文章时的时间处理: 显示格式YYYY-MM-DD,将获取的时间进行`切割`
    
```
$article.find('.time').attr('data-shared-at').split('T')[0]
```    

- 调整首页中个人文章列表中数据获取,提取`公共`模块`util/convertString.js`处理获取的数据: **评论数/喜欢数/阅读量** 

```
function getLatestNumberWithSpace(string) {
    var splittedString = string.split(' ');
    return splittedString[splittedString.length-1]
}

```
    
- 添加自动同步功能: **个人信息/新文章**,使用模块[node-schedule](https://github.com/node-schedule/node-schedule)

```
function myInfo(){
    myInfoSchema.find({'date': today},function (err, result) {
        if (result.length == 0){
            request.get('http://www.jianshu.com' + myPageHref).end(function (err, res) {
                var $ = cheerio.load(res.text);
                var following = $('.clearfix').find('b').eq(0).text();
                var follower = $('.clearfix').find('b').eq(1).text();
                myInfoSchema.create({
                    userHref: myPageHref,
                    date: today,
                    following: following,
                    follower: follower
                },function (err, result) {
                    if (err) return next(err);
                });
            });
        }
    });
}

function syncData() {
    var rule = new schedule.RecurrenceRule();
    rule.second = 30;
    schedule.scheduleJob(rule, function () {
        myInfo();
    });
}
```

- `重构`获取文章列表方法

    
    *   提取`proxy/article.js`文档操作方法，针对Mongoose中的Scheme进行操作
    
    ```
    exports.getAllArticles = function (callback) {
      article.find({},callback)
    };

    ```

    *   调整获取文章列表数据`routes/jianshu.com`
    
    ```
    article.getAllArticles(function (err, articles) {
    
        if (err) return next(err);  
        res.render('jianshu', {articles: articles});
    
        });
    
    ```

## **20160919**

- 完善首页中的个人文章的链接拼接

- 添加首页个人文章内容测试代码

## **20160817**

- 删除文章列表页面中已注释的代码

- 添加获取自己文件的数据,及返回至前端-未完成链接获取

```
    result.forEach(function (info) {
      // console.log('Date:' + info.date);
      myInfo.push({
        date: info.date,
        following: info.following,
        follower: info.follower
      });
    });
    request.get('http://www.jianshu.com' + myPageHref)
        .end(function (err, resT) {
          var $ = cheerio.load(resT.text);
          $('.article-list li').each(function (idx, article) {
            var $article = $(article);
            myArticle.push({
                article: $article.find('.title a').text(),
                publishDate: $article.find('.time').attr('data-shared-at'),
                articleHref: $article.find('.title a').attr('href'),
                reading: $article.find('.list-footer a').eq(0).text(),
                comment: $article.find('.list-footer a').eq(1).text(),
                favorite: $article.find('.list-footer a').eq(2).text()
            })
          });
          res.render('index', {info: myInfo,myArticle: myArticle});
        });

```

## **20160816**

- 添加文章列表、同步文章测试:存在`同步最新文章`、`文章标题`、`作者`,两个页面内容一样,测试`验证项`也一样。

```
it('Verify page content',function (done) {
    request.get('/jianshu')
        .expect(200)
        .expect(function (res) {
            if (!(res.text.indexOf("同步最新文章"))) throw new Error("missing sync latest article link");
            if (!(res.text.indexOf("文章标题"))) throw new Error("missing article content about title");
            if (!(res.text.indexOf("作者"))) throw new Error("missing article content about author");
        })
        .end(done);
});
```

- 添加首页测试:存在`文章列表`、`日期`、`关注`、`粉丝`,及`2016`数据,__测试不太严谨,但可测试功能__

```
it('Exist:go to articles content',function (done) {
    request.get('')
        .expect(200)
        .expect(function (res) {
            if (!(res.text.indexOf("文章列表"))) throw new Error("missing go to article content");
            if (!(res.text.indexOf("日期"))) throw new Error("missing myinfo content about date");
            if (!(res.text.indexOf("关注"))) throw new Error("missing myinfo content about following");
            if (!(res.text.indexOf("粉丝"))) throw new Error("missing myinfo content about follower");
            if (!(res.text.indexOf("2016"))) throw new Error("missing myinfo data");
        })
        .end(done);
});
```

- 调整测试超时时间为10S,同步使用文章时,使用时间较长, [gulp-mocha](https://github.com/sindresorhus/gulp-mocha)

```
gulp.src(['test/**.js'], { read: false})
    .pipe(mocha({
        reporter: 'spec',
        globals: {
            should: require('should')
        },
        timeout: 10000
    }));
```

## **20160815**

- 重构测试代码: 抽取URL

    - 添加服务器自动构建
        - 添加`gulp-nodemon`,`browser-sync`至`devDependencies`
        - 调整`gulpfile.js`:添加自动监听client和server端的代码变化,并及时重新构建
        [http://localhost:4000](http://localhost:4000):为Browser-sync同步监听客户端,并自动刷新前端页面
        [http://localhost:3000](http://localhost:3000):为无browser-sync效果

## **20160811**

- 删除重复的`myinfo`数据

```
db.myinfos.remove({"_id" : ObjectId("57a810b87a33b27050c8529f")})
```

- 添加测试框架`supertest`,构建工具`gulp`

```
gulp.task('test', function() {
    gulp.src(['test/**.js'], { read: false})
        .pipe(mocha({
            reporter: 'spec',
            globals: {
                should: require('should')
            }
        }));
});

```

## **20160808**

- 重构：提取获取文章列表的公共方法 -- Block


## **20160804**

- 完成同步文章列表的功能
    - 在获取新文章后,再使用`render`到到文章列表模板

```
async.mapLimit(articleTitles,5,function (article, callback) {
    fetchUrl(article,callback);
},function (err, result) {
    console.log('获取数据结束');
    var resultsAllArticles = [];
    articleSchema.find({},function (err, result) {
        if (err) return next(err);
        result.forEach(function (article) {
            resultsAllArticles.push({
                articleTitle: article.title,
                articleHref: article.articleHref,
                author: article.author,
                authorHref: article.authorHref
            });
        });
        res.render('jianshu', {results: resultsAllArticles});
    });
});
```

## **20160803**

- `index`页面显示自己的数据following/follower

```
  div
    table
      thead
        tr
          td 日期
          td 关注
          td 粉丝
      tbody
        each result in info
          tr
            td #{result.date}
            td #{result.following}
            td #{result.follower}

```

- 每次刷新页面时,会验证是否已经有今天的数据,如果没有则插入

```
  myInfoSchema.find({'userHref': '/users/552f687b314b'},function (err, result) {
    var myInfo = [];
    result.forEach(function (info) {
      console.log('Date:' + info.date);
      myInfo.push({
        date: info.date,
        following: info.following,
        follower: info.follower
      });
    });
    res.render('index', { title: 'Express' ,info: myInfo});
  });

```

## **20160802**

- 在首页中添加每天自己的`粉丝`、`收获喜欢`数量,并存入数据库中
    - `myInfo`模型

```
var myInfoScheme = new Schema({
    userHref: String,
    date: String,
    following: Number,
    follower: Number
});

```

    - 插入数据库

```
request.get('http://www.jianshu.com' + myPageHref).end(function (err, res) {
    var $ = cheerio.load(res.text);
    var following = $('.clearfix').find('b').eq(0).text();
    var follower = $('.clearfix').find('b').eq(1).text();
    myInfoSchema.create({
      userHref: myPageHref,
      date: new Date().toDateString(),
      following: following,
      follower: follower
    },function (err, result) {
      if (err) return next(err);
    });
});
```

    - 日期存入格式为: `new Date().toDateString()`,使用字符串进行判断是否已经存入

```
  myInfoSchema.find({'date': new Date().toDateString()},function (err, result) {
    if (result.length == 0){
      request.get('http://www.jianshu.com' + myPageHref).end(function (err, res) {
        var $ = cheerio.load(res.text);
        var following = $('.clearfix').find('b').eq(0).text();
        var follower = $('.clearfix').find('b').eq(1).text();
        myInfoSchema.create({
          userHref: myPageHref,
          date: new Date().toDateString(),
          following: following,
          follower: follower
        },function (err, result) {
          if (err) return next(err);
        });
      });
    }
  });
```

- 更新`mongo`数据库中`myInfo`数据

```
db.myinfos.update({'userHref':'/users/552f687b314b'},{$set:{'date':'Tue Aug 01 2016'}})

```

- 存入文章时,一并存入作者数据。并需要对文章及作者数据进行去重

```
articleSchema.find({articleHref:article.articleHref},function (err, findArticle) {
    console.log(findArticle);
    if (findArticle.length == 0) {
        articleSchema.create({
            title: article.articleTitle,
            articleHref: article.articleHref,
            author: article.author,
            authorHref: article.authorHref
        },function(err, result) {
            if (err) return next(err);
        });
    }
});
authorSchema.find({id:article.authorHref},function (err, findAuthor) {
    if (findAuthor.length == 0) {
        authorSchema.create({
            id: article.authorHref,
            author: article.author,
            following: following,
            follower: follower
        },function(err, result) {
            if (err) return next(err);
        });
    }
});
```


## **20160727**

- mongoose中`createConnection`与`connection`的用法区别

    - `createConnectoin`用法

```
var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/jianshu');

var Schema = mongoose.Schema;

var articleScheme = new Schema({
    title: String,
    articleHref: String,
    author: String,
    authorHref: String
});

module.exports = db.model('article', articleScheme);

```

    - `connection`用法

```
var mongoose = require('mongoose');
mongoose.createConnection('mongodb://localhost/jianshu');

var Schema = mongoose.Schema;

var articleScheme = new Schema({
    title: String,
    articleHref: String,
    author: String,
    authorHref: String
});

module.exports = mongoose.model('article', articleScheme);

```

- 作者数据存入`author`中,存入数据:authorHref/author/following/follower
    
    - `model`:author.js`

```
var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/jianshu');

var Schema = mongoose.Schema;

var authorScheme = new Schema({
    id: String,
    author: String,
    following: Number,
    follower: Number
});

module.exports = db.model('author', authorScheme);

```

    - 插入数据`routes/jianshu.js`

```
authorSchema.find({id:article.authorHref},function (err, findAuthor) {
    console.log(findAuthor);
    if (findAuthor.length == 0) {
        authorSchema.create({
            id: article.authorHref,
            author: article.author,
            following: following,
            follower: follower
        },function(err, result) {
            if (err) return next(err);
        });
    }
});
```


## **20160726**

- 针对存入的文章进行去重

    - 针对`mongo`的链接使用`createConnection`。若使用`connect`多次操作`schema`时,会出现`Error: Trying to open unclosed connection.`。参考:[http://mongoosejs.com/docs/api.html#index_Mongoose-createConnection](http://mongoosejs.com/docs/api.html#index_Mongoose-createConnection)

    - 依据文章链接进行判断是否已存入,标题有可能相同

```
articleSchema.find({articleHref:article.articleHref},function (err, findArticle) {
    console.log(findArticle);
    if (findArticle.length == 0) {
        articleSchema.create({
            title: article.articleTitle,
            articleHref: article.articleHref,
            author: article.author,
            authorHref: article.authorHref
        },function(err, result) {
            if (err) return next(err);
        });
    }
});
```


## **20160720**

- 添加数据库中存储数据**作者**、**作者信息链接**
    
    - 添加`scheme`配制

```
var articleScheme = new Schema({
    title: String,
    articleHref: String,
    author: String,
    authorHref: String
});
```

    - 将获取的数据一并保存至数据库中

```
articleScheme.create({
    title: article.articleTitle,
    articleHref: article.articleHref,
    author: article.author,
    authorHref: article.authorHref
},function(err, result) {
    if (err) return next(err);
});
```

    - 在mongo中查询插入的数据。使用mongo链接查询时,建议使用`pretty()`方法来将返回的数据展示的更易读

```
> db.articles.find({'_id': ObjectId('578f07f5bf9d4937b7c9f0a9')}).pretty()
{
        "_id" : ObjectId("578f07f5bf9d4937b7c9f0a9"),
        "title" : "就Excel而言，掌握这些就足以应付大部分工作了",
        "articleHref" : "http://www.jianshu.com/p/aab3f09f015b",
        "author" : "北大小笨",
        "authorHref" : "http://www.jianshu.com/users/2528bd080aa8",
        "__v" : 0
}

```

## **20160719**

- 使用`mongodb`数据库存储获取的数据:首页文章、文章链接

    - 使用`mongoose`来操作和维护`mongodb`

    - 使用`article`collection来存储数据

```
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/jianshu');

var Schema = mongoose.Schema;

var articleScheme = new Schema({
    title: String,
    href: String
});

module.exports = mongoose.model('article', articleScheme);

```

    - 向数据库中插入每次查询的结果

```
articleScheme.create({
    title: article.articleTitle,
    href: article.href
},function(err, result) {
    if (err) return next(err);
});
```

- 使用`async`获取数据的并发数,确保每次均可完整获取数据

    - `async.mapLimit`异常的执行最大的执行数,从1开始

    - 将所有的返回数据全部存放至`results`中,便于在前端展示

```
var conCurrencyCount = 0;
var fetchUrl = function (article, callback) {
    var delay = parseInt((Math.random() * 10000000) % 2000,10);
    conCurrencyCount++;
    console.log('并发数:' + conCurrencyCount + ',访问的页面是:' + article.authorLink + ',控制的延迟:' + delay);
    request.get(article.authorLink)
        .end(function (err, res) {
            if (err){
                return next(err);
            }
            var $ = cheerio.load(res.text);
            var author = $('.basic-info').find('h3').text();
            var following = $('.clearfix').find('b').eq(0).text();
            var follower = $('.clearfix').find('b').eq(1).text();
            results.push({
                articleTitle: article.articleTitle,
                articleUrl: article.href,
                author: author,
                authorUrl: article.authorLink,
                following: following,
                follower: follower
            })
        });
    setTimeout(function () {
        conCurrencyCount--;
        callback(null,article + ' html content');
    },delay);
};

async.mapLimit(articleTitles,5,function (article, callback) {
    fetchUrl(article,callback);
},function (err, result) {
    console.log('获取数据结束');
    res.render('jianshu', { title: '简书', results: results});
});

```

## **20160718**

- 获取每位作者的**粉丝**及**关注**

    - `有时`会出现获取不到**粉丝**和**关注**,应该是由于简书官网做了`并发访问`限制

    - 使用`eventproxy`获取首页信息后,再获取每位作者的信息链接页面数据

```
var ep = new eventProxy();
ep.after('authorInfo_html',articleTitle.length,function (userInfors) {
    articleInfors = userInfors.map(function (userInfo) {
        var articleTitle = userInfo[0];
        var articleUrl = userInfo[1];
        var authorHtml = userInfo[2];
        var authorUrl = userInfo[3];
        var $ = cheerio.load(authorHtml);
        var author = $('.basic-info').find('h3').text();
        var following = $('.clearfix').find('b').eq(0).text();
        var follower = $('.clearfix').find('b').eq(1).text();
        return ({
            articleTitle: articleTitle,
            articleUrl: articleUrl,
            author: author,
            authorUrl: authorUrl,
            following: following,
            follower: follower
        });
    });

    res.render('jianshu', { title: '简书',articleTitle: articleTitle,showPage:0,articleInfors: articleInfors });
});

articleTitle.forEach(function (article) {
    console.log('获取:' + article.authorLink + '中');
    request.get(article.authorLink)
        .end(function (err, res) {
            console.log('获取:' + article.authorLink + '完成');
            var $ = cheerio.load(res.text);
            console.log('Init following is :' + $('.clearfix li b').eq(0).text());
            ep.emit('authorInfo_html',[article.articleTitle,article.href,res.text,article.authorLink]);
        });
});
});
```

    - 调整前端展示及添加作者信息页面的链接功能

```
  div
    table
      thead
        tr
          td 文章标题
          td 作者
          td 关注
          td 粉丝
      tbody
        each info in articleInfors
          tr
            td
              a(href='#{info.articleUrl}') #{info.articleTitle}
            td
              a(href='#{info.authorUrl}') #{info.author}
            td #{info.following}
            td #{info.follower}

```

- 添加文章列表中作者的信息链接
    
    - 获取作者的信息链接

```
articleTitle.push({
    articleTitle: $article.find('.title a').text(),
    author: $article.find('.author-name').text(),
    authorLink: 'http://www.jianshu.com' + $article.find('.author-name').attr('href'),
    href: 'http://www.jianshu.com' + $article.find('.title a').attr('href')
})
```

    - 添加到前端展示的信息中

```
  tr
    td #{article.articleTitle}
    td
      a(href='#{article.authorLink}') #{article.author}
    td
      a(href='#{article.href}') #{article.href}
```

## **20160714** 

- 获取首页文章的作者名及文章链接

    - 遍历每个文章块`.article-list li`,再从每个块中获取对应的文章标题、作者、链接地址

```
$('.article-list li').each(function (idx, article) {
                var $article = $(article);
                articleTitle.push({
                    articleTitle: $article.find('.title a').text(),
                    author: $article.find('.author-name').text(),
                    href: 'http://www.jianshu.com'+$article.find('a').attr('href')
                })
            });
```

    - 在`views`中再对获取的内容进行展示,同时修改`thead`与`a`的css样式

```
    table
      thead
        tr
          td 文章标题
          td 作者
          td 链接
      tbody
        each article in articleTitle
          tr
            td #{article.articleTitle}
            td #{article.author}
            td
              a(href='#{article.href}') #{article.href}

```

    - 尝试针对不同数据进行不同样式展示

```
tbody
        case showPage
          when 0
            each article in articleTitle
              tr
                td #{article.articleTitle}
                td #{article.author}
                td
                  a(href='#{article.href}') #{article.href}
          when 1
            tr
              td 1
              td 2
              td 3
          default
            tr
              td 0
              td 0
              td 0
```

## **20160713** 

- 实时爬取简书首页的文章列表 [http://localhost:3000/jianshu](http://localhost:3000/jianshu)

```
    var articleTitle = [];
    request.get('http://www.jianshu.com/')
        .end(function (err,gres) {
            if (err){
                return next(err);
            }
            var $ = cheerio.load(gres.text);
            $('li .title').each(function (idx, title) {
                var $title = $(title);
                articleTitle.push({articleTitle:$title.text()})
            });
            res.render('jianshu', { title: '简书',articleTitle: articleTitle });
        });

```

    - 获取文章标题,以列表的形式展示

    - `cheerio`:用来转换返回的res数据,并支持jQuery处理

    - `superagent`:模拟网络请求

    - `nodemon`:用来实际检测`Node`文件是否有变更,有变更则自动重新部署。便于开发调度。启动命令:`./node_modules/nodemon/bin/nodemon.js jianshu`
    
    - 添加`jianshu`的route和view模板,并将结果遍历出来

```
  div
    table
      thead
        tr
          td 文章标题
      tbody
        each article in articleTitle
          tr
            td #{article.articleTitle}

```

    - 添加`thead`的css样式

```

thead {
  color: #00B7FF;
  font: 20px "Lucida Grande", Helvetica, Arial, sans-serif;
}

```