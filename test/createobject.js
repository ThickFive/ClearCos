const CONFIG = require('../config');
const COS = require('cos-nodejs-sdk-v5');
const BASE = require('./base');
const {putObject} = require('../src/cos/object');
const LOG = require('../log/loger').TestLoger;

/**
 *  批量上传文件
 *  @param {Number} count           需要上传的文件数量
 *  @param {Number} bucketIndex     存储桶索引, 从0开始递增
 *  @return {Promise}           
 */
async function batchPutObjects(count, bucketIndex) {
    LOG.info(`开始上传${count}个文件...`);
    const cos = new COS({
        SecretId: CONFIG.SecretId,
        SecretKey: CONFIG.SecretKey
    });
    const files = [];
    for (let i = 0; i < count; i++) {
        const Bucket = `${BASE.Bucket}${bucketIndex}-${CONFIG.AppId}`;
        const Region = BASE.Region;
        const Key = `${BASE.Key}${i}`;
        const Body = '测试文字';
        files.push({Bucket, Region, Key, Body});
    }
    const createObject = async (file) => {
        const {Bucket, Region, Key, Body} = file;
        await putObject.call(cos, {Bucket, Region, Key, Body});
        LOG.info(`成功上传了文件 Key: ${Key}, Bucket: ${Bucket}, Region: ${Region}`);
    }
    await Promise.all(files.map(file => createObject(file)));
    LOG.info(`成功上传了${count}个文件: \r\n`, files);
}

module.exports = {
    batchPutObjects
}

