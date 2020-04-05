const CONFIG = require('../config');
const COS = require('cos-nodejs-sdk-v5');
const {getService} = require('./cos/service');
const {getBucket, deleteBucket} = require('./cos/bucket');
const {deleteObject} = require('./cos/object');
const {multipartList, multipartAbort} = require('./cos/multipart');
const {LOG} = require('../log/loger');

/**
 *  清除文件与文件桶, 依次删除每一个文件、碎片与文件桶, 速度慢但是稳定
 */
async function clearSync() {
    LOG.info('开始清除, 初始化配置...');
    const cos = new COS({
        SecretId: CONFIG.SecretId,
        SecretKey: CONFIG.SecretKey
    });

    LOG.info('获取存储桶列表...');
    const {Buckets} = await getService.call(cos);
    LOG.info(Buckets);

    for (let i = 0; i < Buckets.length; i++) {
        const bucket = Buckets[i];
        LOG.info(`开始清除存储桶... Bucket: ${bucket.Name} Region: ${bucket.Location}`);
        //  获取当前存储桶文件列表并删除
        const {Contents} = await getBucket.call(cos, {
            Bucket: bucket.Name,
            Region: bucket.Location,
            MaxKeys: CONFIG.MaxKeys
        });
        LOG.info('文件总数', Contents.length);
        for (let i = 0; i < Contents.length; i++) {
            const content = Contents[i];
            await deleteObject.call(cos, {
                Bucket: bucket.Name,
                Region: bucket.Location,
                Key: content.Key,
            });
            LOG.info(`成功删除文件 Key: ${content.Key} Bucket: ${bucket.Name} Region: ${bucket.Location}`);
        }
        //  获取当前存储桶文件碎片列表并删除
        const {Upload} = await multipartList.call(cos, {
            Bucket: bucket.Name,
            Region: bucket.Location,
            MaxUploads: CONFIG.MaxKeys
        });
        LOG.info('碎片总数', Upload.length);
        for (let i = 0; i < Upload.length; i++) {
            const task = Upload[i];
            await multipartAbort.call(cos, {
                Bucket: bucket.Name,
                Region: bucket.Location,
                Key: task.Key,
                UploadId: task.UploadId
            });
            LOG.info(`成功删除文件碎片 Key: ${task.Key} Bucket: ${bucket.Name} Region: ${bucket.Location}`);
        }
        //  删除当前存储桶
        await deleteBucket.call(cos, {
            Bucket: bucket.Name,
            Region: bucket.Location,
        });
        LOG.info(`成功删除存储桶 Bucket: ${bucket.Name} Region: ${bucket.Location}`); 
    }

    LOG.info('成功完成清除!!!--------------------------------------OK!!!----------------------------------------\r\n');
}

/**
 *  清除文件与文件桶, 并发版本, 速度快但是出错的概率比较大(腾讯云的原因)
 */
async function clearAsync() {
    LOG.info('开始清除, 初始化配置...');
    const cos = new COS({
        SecretId: CONFIG.SecretId,
        SecretKey: CONFIG.SecretKey
    });

    LOG.info('获取存储桶列表...');
    const {Buckets} = await getService.call(cos);
    LOG.info(Buckets);

    const clearBucket = async (bucket) => {
        LOG.info(`开始清除存储桶... Bucket: ${bucket.Name} Region: ${bucket.Location}`);
        //  获取当前存储桶文件列表并删除
        const {Contents} = await getBucket.call(cos, {
            Bucket: bucket.Name,
            Region: bucket.Location,
            MaxKeys: CONFIG.MaxKeys
        });
        LOG.info('文件总数', Contents.length);
        await Promise.all(Contents.map(content => clearObject(content, bucket)));
        //  获取当前存储桶文件碎片列表并删除
        const {Upload} = await multipartList.call(cos, {
            Bucket: bucket.Name,
            Region: bucket.Location,
            MaxUploads: CONFIG.MaxKeys
        });
        LOG.info('碎片总数', Upload.length);
        await Promise.all(Upload.map(task => clearFragementation(task, bucket)));
        //  删除当前存储桶
        await deleteBucket.call(cos, {
            Bucket: bucket.Name,
            Region: bucket.Location,
        });
        LOG.info(`成功删除存储桶 Bucket: ${bucket.Name} Region: ${bucket.Location}`); 
    }

    const clearObject = async (content, bucket) => {
        await deleteObject.call(cos, {
            Bucket: bucket.Name,
            Region: bucket.Location,
            Key: content.Key,
        });
        LOG.info(`成功删除文件 Key: ${content.Key} Bucket: ${bucket.Name} Region: ${bucket.Location}`);
    }

    const clearFragementation = async (task, bucket) => {
        await multipartAbort.call(cos, {
            Bucket: bucket.Name,
            Region: bucket.Location,
            Key: task.Key,
            UploadId: task.UploadId
        });
        LOG.info(`成功删除文件碎片 Key: ${task.Key} Bucket: ${bucket.Name} Region: ${bucket.Location}`);
    }

    await Promise.all(Buckets.map(bucket => clearBucket(bucket)));
    LOG.info('成功完成清除!!!--------------------------------------OK!!!----------------------------------------\r\n');
}

module.exports = {
    clearSync,
    clearAsync
};