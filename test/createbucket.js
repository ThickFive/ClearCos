const CONFIG = require('../config');
const COS = require('cos-nodejs-sdk-v5');
const BASE = require('./base');
const {putBucket} = require('../src/cos/bucket');
const LOG = require('../log/loger').TestLoger;

/**
 *  批量创建存储桶
 *  @param {Number} count       需要创建的存储桶数量
 *  @return {Promise}           
 */
async function batchPutBuckets(count) {
    LOG.info(`开始创建${count}个存储桶...`);
    const cos = new COS({
        SecretId: CONFIG.SecretId,
        SecretKey: CONFIG.SecretKey
    });
    const buckets = [];
    for (let i = 0; i < count; i++) {
        const  Bucket = `${BASE.Bucket}${i}-${CONFIG.AppId}`;
        const  Region = BASE.Region;
        buckets.push({Bucket, Region});
    }
    const createBucket = async (bucket) => {
        const {Bucket, Region} = bucket;
        await putBucket.call(cos, bucket);
        LOG.info(`成功创建了存储桶 Bucket: ${Bucket}, Region: ${Region}`);
    }
    await Promise.all(buckets.map(bucket => createBucket(bucket)));
    LOG.info(`成功创建了${count}个存储桶:\r\n`, buckets);
}

module.exports = {
    batchPutBuckets
}