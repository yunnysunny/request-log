const app = require('../express/src/app-with-mongodb');
const request = require('supertest');
const { expect } = require('chai');
const rand = Math.random();
const reqUrl = '/?rand=' + rand;
const {
    requestLogModel,
    CUSTOM_HEADER_KEY_MY_ID
} = require('../express/src/config');
const MY_ID = Math.random() + '';
process.env.NODE_ENV = 'test';
describe.only('mongodb test:', function() {
    it('success when request ' + reqUrl + ' ok', async function() {
        await request(app)
            .get(reqUrl)
            .set(CUSTOM_HEADER_KEY_MY_ID, MY_ID)
            .expect(200);
    });

    it('sleep 500ms', function(done) {
        setTimeout(() => {
            done();
        }, 500);
    });

    it('the latest url is ' + reqUrl, async function() {
        const item = await requestLogModel.findOne({}, {
            original_url: 1, custom_headers: 1, custom_envs: 1
        }, {
            sort: { _id: -1 }, lean: true
        }).exec();

        if (!item) {
            throw new Error('save to mongo failed');
        }

        expect(item.original_url).equal(reqUrl);
        expect(item.custom_headers).to.have.property(CUSTOM_HEADER_KEY_MY_ID).and.equal(MY_ID);
        expect(item.custom_envs).to.have.property('NODE_ENV').and.equal('test');
    });

    it('success request when request /do-get-res-code', async function() {
        await request(app)
            .get('/do-get-res-code')
            .expect(200);
    });

    it('sleep 500ms', function(done) {
        setTimeout(() => {
            done();
        }, 500);
    });

    it('the latest url is /do-get-res-code and res_code is 1000', async function() {
        const item = await requestLogModel.findOne({}, { original_url: 1, res_code: 1 }, {
            sort: { _id: -1 }, lean: true
        }).exec();

        if (!item) {
            throw new Error('save to mongo failed');
        }

        expect(item.original_url).equal('/do-get-res-code');
        expect(item.res_code).equal(1000);
    });

    it('abort the request ' + reqUrl, async function() {
        let hasDone = false;
        const req = request(app)
            .get('/abort')
            .query({ abort: true })
            .abort();

        req.end(function(err: any) {
            if (err) {
                if (hasDone) {
                    return;
                }
                hasDone = true;
                throw err;
            }
            if (!hasDone) {
                hasDone = true;
            }
        });

        await new Promise(resolve => setTimeout(resolve, 1000));

        if (!hasDone) {
            hasDone = true;
        }
    });

    it('sleep 500ms', function(done) {
        setTimeout(() => {
            done();
        }, 500);
    });

    it('get abort request', async function() {
        const item = await requestLogModel.findOne({}, { req_data: 1, aborted: 1 }, {
            sort: { _id: -1 }, lean: true
        }).exec();

        if (!item) {
            throw new Error('save to mongo failed');
        }

        expect(item.aborted).to.be.equal(true);
    });

    it('request with error content length', async function() {
        const data = { rand: MY_ID };
        await request(app)
            .post('/echo')
            .send(data)
            .expect(200);
    });

    it('sleep 500ms', function(done) {
        setTimeout(() => {
            done();
        }, 500);
    });

    it('get res_data success', async function() {
        const item = await requestLogModel.findOne({}, { original_url: 1, res_code: 1, res_data: 1 }, {
            sort: { _id: -1 }, lean: true
        }).exec();

        if (!item) {
            throw new Error('save to mongo failed');
        }

        expect(item.original_url).equal('/echo');
        expect(item.res_data.data.rand).equal(MY_ID);
    });
});