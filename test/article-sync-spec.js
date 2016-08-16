var config = require('./config');
var request = require('supertest')(config.baseUrl);

describe('Article Sync Page',function () {
    it('Verify page content',function (done) {
        request.get('/jianshu/sync')
            .expect(200)
            .expect(function (res) {
                if (!(res.text.indexOf("同步最新文章"))) throw new Error("missing sync latest article link");
                if (!(res.text.indexOf("文章标题"))) throw new Error("missing article content about title");
                if (!(res.text.indexOf("作者"))) throw new Error("missing article content about author");
            })
            .end(done);
    });
});
