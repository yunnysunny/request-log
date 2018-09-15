const app = require('../express/src/app-no-session');

const request = require('supertest');
describe('no session test:',function() {
    it('sucess when request / ok',function(done) {
        request(app)
            .get('/')
            .expect(200)
            .end(function(err) {
                if (err) {
                    return done(err);
                }
                done();
            });
    });
});