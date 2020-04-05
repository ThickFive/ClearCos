/**
 *  查询文件列表
 *  腾讯云限制最多一次查询1000条, 分次查询获取所有结果后返回
 *  @param {Object} params  具体参数参考 https://cloud.tencent.com/document/product/436/8629
 *  @return {Promise}
 */
function getBucket(params) {
    return new Promise((resolve, reject) => {
        let _Contents = [];
        const _getBucket = (params) => {
            this.getBucket(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    const {NextMarker, IsTruncated, Contents} = data;
                    //  为了避免可能出现的Key重复导致的bug, 过滤掉Key相同的元素
                    _Contents = _Contents.concat(Contents);
                    const Keys = _Contents.map(item => item.Key);
                    _Contents = _Contents.filter((item, index) => {
                        return Keys.indexOf(item.Key) == index;
                    });
                    if (IsTruncated == 'true') {
                        params.Marker = NextMarker;
                        _getBucket(params);
                    } else {
                        data.Contents = _Contents;
                        resolve(data);
                    }
                }
            });
        }
        _getBucket(params);
    });
}

/**
 *  创建存储桶
 *  @param {Object} params  具体参数参考 https://cloud.tencent.com/document/product/436/8629
 *  @return {Promise}
 */
function putBucket(params) {
    return new Promise((resolve, reject) => {
        this.putBucket(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

/**
 *  删除存储桶
 *  @param {Object} params  具体参数参考 https://cloud.tencent.com/document/product/436/8629
 *  @return {Promise}
 */
function deleteBucket(params) {
    return new Promise((resolve, reject) => {
        this.deleteBucket(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

module.exports = {
    putBucket,
    getBucket,
    deleteBucket
}