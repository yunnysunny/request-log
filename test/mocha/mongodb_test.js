const app = require('../express/src/app-with-mongodb');
// const path = require('path');
const request = require('supertest');
const {expect} = require('chai');
const rand = Math.random();
const reqUrl = '/?rand='+rand;
const {
    requestLogModel,
    CUSTOM_HEADER_KEY_MY_ID
} = require('../express/src/config');
const MY_ID = Math.random() + '';
describe('mongodb test:',function() {
    it('sucess when request ' + reqUrl + ' ok',function(done) {
        request(app)
            .get(reqUrl)
            .set(CUSTOM_HEADER_KEY_MY_ID, MY_ID)
            .expect(200)
            .end(function(err) {
                if (err) {
                    return done(err);
                }
                done();
            });
    });
    it('sleep 500ms', function(done) {
        setTimeout(() => {
            done();
        }, 500);
    });
    it('the lastest url is ' + reqUrl,function(done) {
        requestLogModel.findOne({},{original_url:1, custom_headers: 1},{
            sort:{_id:-1},lean:true
        },function(err,item) {
            if (err) {
                return done(err);
            }
            if (!item) {
                return done('save to mongo failed');
            }
            expect(item.original_url).equal(reqUrl);
            expect(item.custom_headers).to.have.property(CUSTOM_HEADER_KEY_MY_ID).and.equal(MY_ID);
            done();
        });
    });
    it('success request when request /do-get-res-code',function(done) {
        request(app)
            .get('/do-get-res-code')
            .expect(200)
            .end(function(err) {
                if (err) {
                    return done(err);
                }
                done();
            });
    });
    it('sleep 500ms', function(done) {
        setTimeout(() => {
            done();
        }, 500);
    });
    it('the lastest url is /do-get-res-code and res_code is 1000',function(done) {
        requestLogModel.findOne({},{original_url:1,res_code:1},{
            sort:{_id:-1},lean:true
        },function(err,item) {
            if (err) {
                return done(err);
            }
            if (!item) {
                return done('save to mongo failed');
            }
            expect(item.original_url).equal('/do-get-res-code');
            expect(item.res_code).equal(1000);
            done();
        });
    });

    it('abort the request ' + reqUrl,function(done) {
        var hasDone = false;
        request(app)
            .get('/abort')
            .query({abort:true})
            // .expect(200)
            .abort()
            .end(function(err) {
                if (err) {
                    if (hasDone) {
                        return;
                    }
                    hasDone = true;
                    return done(err);
                }
                if (!hasDone) {
                    done();
                    hasDone = true;
                }
                
            });
        setTimeout(function() {
            if (!hasDone) {
                done();
                hasDone = true;
            }
        }, 1000);
    });
    it('sleep 500ms', function(done) {
        setTimeout(() => {
            done();
        }, 500);
    });
    it('get abort requst', function(done) {
        requestLogModel.findOne({},{req_data:1, aborted: 1},{
            sort:{_id:-1},lean:true
        },function(err,item) {
            if (err) {
                return done(err);
            }
            if (!item) {
                return done('save to mongo failed');
            }
            expect(item.aborted).to.be.equal(true);
            done();
        });
    });
    it('request with error content length',function(done) {
        
        const data = {rand:MY_ID};
        request(app)
            .post('/echo')
            .send(data)
            .expect(200)
            .end(function(err) {
                if (err) {
                    return done(err);
                }
                done();
            });

    });
    it('sleep 500ms', function(done) {
        setTimeout(() => {
            done();
        }, 500);
    });
    it('get res_data success',function(done) {
        requestLogModel.findOne({},{original_url:1,res_code:1, res_data:1},{
            sort:{_id:-1},lean:true
        },function(err,item) {
            if (err) {
                return done(err);
            }
            if (!item) {
                return done('save to mongo failed');
            }
            expect(item.original_url).equal('/echo');
            expect(item.res_data.data.rand).equal(MY_ID);
            done();
        });
    });

});