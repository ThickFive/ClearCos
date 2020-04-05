/**
 *  获取存储桶列表
 *  将原生函数改写为 Promise 形式, this 必须是 COS 对象
 *  @return {Promise}
 */
function getService() {
    return new Promise((resolve, reject) => {
        this.getService((err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    });
}

module.exports = {
    getService
}