# 简书爬虫

---

_此功能纯粹为个人**意想**一个功能,利用业余时间来完成。_

**源代码地址** [https://github.com/aimer1124/JianshuSpider](https://github.com/aimer1124/JianshuSpider)

**需求列表**

- 【Done】获取简书的首页文章,并将**文章标题**、**文章链接**、**作者**、**作者信息链接**存入数据库
- 【Done】文章数据存入`article`,作者数据存入`author`  
- 【Done】记录每天自己的`粉丝`、`收获喜欢`数量,存入数据库`myInfo`中 
- 【Done】将每天自己的数据展示默认展示在首页

---

## **20160803**

### `index`页面显示自己的数据following/follower

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

### 每次刷新页面时,会验证是否已经有今天的数据,如果没有则插入

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

### 在首页中添加每天自己的`粉丝`、`收获喜欢`数量,并存入数据库中
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

### 更新`mongo`数据库中`myInfo`数据

```
db.myinfos.update({'userHref':'/users/552f687b314b'},{$set:{'date':'Tue Aug 01 2016'}})

```

### 存入文章时,一并存入作者数据。并需要对文章及作者数据进行去重

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
### mongoose中`createConnection`与`connection`的用法区别

`createConnectoin`用法

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

`connection`用法

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

### 作者数据存入`author`中,存入数据:authorHref/author/following/follower
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

### 针对存入的文章进行去重
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

### 添加数据库中存储数据**作者**、**作者信息链接**
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

### 使用`mongodb`数据库存储获取的数据:首页文章、文章链接
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

### 使用`async`获取数据的并发数,确保每次均可完整获取数据
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

### 获取每位作者的**粉丝**及**关注**
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

### 添加文章列表中作者的信息链接
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

###获取首页文章的作者名及文章链接
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
### 实时爬取简书首页的文章列表
[http://localhost:3000/jianshu](http://localhost:3000/jianshu)

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