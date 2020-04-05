const {STATE} = require('../config');
const {clear_cos_sync, clear_cos_async} = require('../index');
const {batchPutBuckets} = require('./createbucket');
const {batchPutObjects} = require('./createObject');
const {batchPutFragmentations} = require('./createfragmentation');
const TIMEOUT = 5 * 60 * 1000;  //  jset默认超时时间为5000ms, 根据需要适当延长
const BUCKETCOUNT = 10;
const FILECOUNT = 100;

/**
 *  为了保证每项测试顺利进行, 开始前清空一次 COS, 避免被上一个测试失败的结果影响
 */

test('clear_cos_sync 直接清空COS', async () => {
    expect(await clear_cos_sync()).toBe(STATE.OK);
}, TIMEOUT)

test(`clear_cos_sync 创建${BUCKETCOUNT}个存储桶后清空COS`, async () => {
    await clear_cos_sync();
    await batchPutBuckets(BUCKETCOUNT);
    expect(await clear_cos_sync()).toBe(STATE.OK);
}, TIMEOUT)

test(`clear_cos_sync 创建一个存储桶, 上传${FILECOUNT}个文件后清空COS`, async () => {
    await clear_cos_sync();
    await batchPutBuckets(1);
    await batchPutObjects(FILECOUNT, 0);
    expect(await clear_cos_sync()).toBe(STATE.OK);
}, TIMEOUT)

test(`clear_cos_sync 创建一个存储桶, 生成${FILECOUNT}个文件碎片后清空COS`, async () => {
    await clear_cos_sync();
    await batchPutBuckets(1);
    await batchPutFragmentations(FILECOUNT, 0);
    expect(await clear_cos_sync()).toBe(STATE.OK);
}, TIMEOUT)

test(`clear_cos_sync 创建一个存储桶, 上传${FILECOUNT}个文件, 生成${FILECOUNT}个文件碎片后清空COS`, async () => {
    await clear_cos_sync();
    await batchPutBuckets(1);
    await batchPutObjects(FILECOUNT, 0);
    await batchPutFragmentations(FILECOUNT, 0);
    expect(await clear_cos_sync()).toBe(STATE.OK);
}, TIMEOUT)

test('clear_cos_async 直接清空COS', async () => {
    expect(await clear_cos_async()).toBe(STATE.OK);
}, TIMEOUT)

test(`clear_cos_async 创建${BUCKETCOUNT}个存储桶后清空COS`, async () => {
    await clear_cos_async();
    await batchPutBuckets(BUCKETCOUNT);
    expect(await clear_cos_async()).toBe(STATE.OK);
}, TIMEOUT)

test(`clear_cos_async 创建一个存储桶, 上传${FILECOUNT}个文件后清空COS`, async () => {
    await clear_cos_async();
    await batchPutBuckets(1);
    await batchPutObjects(FILECOUNT, 0);
    expect(await clear_cos_async()).toBe(STATE.OK);
}, TIMEOUT)

test(`clear_cos_async 创建一个存储桶, 生成${FILECOUNT}个文件碎片后清空COS`, async () => {
    await clear_cos_async();
    await batchPutBuckets(1);
    await batchPutFragmentations(FILECOUNT, 0);
    expect(await clear_cos_async()).toBe(STATE.OK);
}, TIMEOUT)

test(`clear_cos_async 创建一个存储桶, 上传${FILECOUNT}个文件, 生成${FILECOUNT}个文件碎片后清空COS`, async () => {
    await clear_cos_async();
    await batchPutBuckets(1);
    await batchPutObjects(FILECOUNT, 0);
    await batchPutFragmentations(FILECOUNT, 0);
    expect(await clear_cos_async()).toBe(STATE.OK);
}, TIMEOUT)
