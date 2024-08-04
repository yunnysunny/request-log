const app = require('../express/src/app-no-param');

const request = require('supertest');
describe('no param test:',function() {
    it('sucess when request / ok',function(done) {
        request(app)
            .get('/')
            .expect(200)
            .end(function(err: any) {
                if (err) {
                    return done(err);
                }
                done();
            });
    });
});