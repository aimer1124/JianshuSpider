# 简书爬虫

## **20160719**

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