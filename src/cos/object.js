/**
 *  上传文件
 *  将原生函数改写为 Promise 形式, this 必须是 COS 对象
 *  @param {Object} params  具体参数参考 https://cloud.tencent.com/document/product/436/8629
 *  @return {Promise}
 */
function putObject(params) {
    return new Promise((resolve, reject) => {
        this.putObject(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

/**
 *  删除文件
 *  将原生函数改写为 Promise 形式, this 必须是 COS 对象
 *  @param {Object} params  具体参数参考 https://cloud.tencent.com/document/product/436/8629
 *  @return {Promise}
 */
function deleteObject(params) {
    return new Promise((resolve, reject) => {
        this.deleteObject(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

module.exports = {
    putObject,
    deleteObject
}