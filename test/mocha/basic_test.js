const request = require('supertest');
const {expect} = require('chai');
const app = require('../express/src/app');

let cookie = '';

describe('basic test',function() {
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
    it('success when set session ok',function(done) {
        request(app).get('/do-login')
            .expect(200).end(function(err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body).to.have.property('code').and.equal(0);
                var header = res.header;
                var setCookieArray = header['set-cookie'];

                for (var i=0,len=setCookieArray.length;i<len;i++) {
                    var value = setCookieArray[i];
                    var result = value.match(/^express_test=([a-zA-Z0-9%\.\-_]+);\s/);
                    if (result && result.length > 1) {
                        exports.cookie = cookie = result[1];
                        break;
                    }
                }
                if (!cookie) {
                    return done(new Error('get cookie fail'));
                }
                done();
            });
    });
    it('success when get session ok',function(done) {
        request(app)
            .get('/login-check')
            .set('Cookie','express_test=' + cookie)
            .expect(200)
            .end(function(err) {
                if (err) {
                    return done(err);
                }
                done();
            });
    });
});