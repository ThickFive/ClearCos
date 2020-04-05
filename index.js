const {STATE} = require('./config');
const {clearSync, clearAsync} = require('./src/clear');
const {LOG} = require('./log/loger');

/**
 *  1). 在 ./config.js 中填入正确的的 COS 配置
 *  2). 执行 clear_cos 函数
 */

async function clear_cos_sync() {
    let state = STATE.OK;
    try {
        await clearSync();
    } catch(err) {
        LOG.error(err);
        state = STATE.ERROR;
    }
    return state;
}

async function clear_cos_async() {
    let state = STATE.OK;
    try {
        await clearAsync();
    } catch(err) {
        LOG.error(err);
        state = STATE.ERROR;
    }
    return state;
}

module.exports = {
    clear_cos_sync,
    clear_cos_async
}

