# 简书爬虫

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