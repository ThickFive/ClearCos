const CONFIG = require('../config');
const COS = require('cos-nodejs-sdk-v5');
const BASE = require('./base');
const {multipartInit} = require('../src/cos/multipart');
const LOG = require('../log/loger').TestLoger;

/**
 *  批量生成文件碎片
 *  @param {Number} count           需要生成的文件碎片数量
 *  @param {Number} bucketIndex     存储桶索引, 从0开始递增
 *  @return {Promise}           
 */
async function batchPutFragmentations(count, bucketIndex) {
    LOG.info(`开始生成${count}个文件碎片...`);
    const cos = new COS({
        SecretId: CONFIG.SecretId,
        SecretKey: CONFIG.SecretKey
    });
    const files = [];
    for (let i = 0; i < count; i++) {
        const Bucket = `${BASE.Bucket}${bucketIndex}-${CONFIG.AppId}`;
        const Region = BASE.Region;
        const Key = `${BASE.Key}${i}`;
        files.push({Bucket, Region, Key});
    }
    const createFragmentation = async (file) => {
        const {Bucket, Region, Key} = file;
        await multipartInit.call(cos, {Bucket, Region, Key});
        LOG.info(`成功生成了文件碎片 Key: ${Key}, Bucket: ${Bucket}, Region: ${Region}`);
    }
    await Promise.all(files.map(file => createFragmentation(file)));
    LOG.info(`成功生成了${count}个文件碎片: \r\n`, files);
}

module.exports = {
    batchPutFragmentations
}