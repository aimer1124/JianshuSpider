var config = require('./config');
var request = require('supertest')(config.baseUrl);

describe('Home Page',function () {
    it('Verify page content',function (done) {
        request.get('')
            .expect(200)
            .expect(function (res) {
                if (!(res.text.indexOf("文章列表"))) throw new Error("missing go to article content");
                if (!(res.text.indexOf("日期"))) throw new Error("missing myinfo content about date");
                if (!(res.text.indexOf("关注"))) throw new Error("missing myinfo content about following");
                if (!(res.text.indexOf("粉丝"))) throw new Error("missing myinfo content about follower");

                if (!(res.text.indexOf("文章标题"))) throw new Error("missing article-title");
                if (!(res.text.indexOf("UI自动化测试之Protractor"))) throw new Error("missing article:UI自动化测试之Protractor");
            })
            .end(done);
    });
});
