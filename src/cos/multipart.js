/**
 *  初始化分片上传, 目的是产生一个文件碎片 UploadId
 *  @param {Object} params  具体参数参考 https://cloud.tencent.com/document/product/436/8629
 *  @return {Promise}
 */
function multipartInit(params) {
    return new Promise((resolve, reject) => {
        this.multipartInit(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

/**
 *  查询碎片 UploadId 列表
 *  腾讯云限制最多一次查询1000条, 分次查询获取所有结果后返回
 *  @param {Object} params  具体参数参考 https://cloud.tencent.com/document/product/436/8629
 *  @return {Promise}
 */
function multipartList(params) {
    return new Promise((resolve, reject) => {
        let _Upload = [];
        const _multipartList = (params) => {
            this.multipartList(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    const {NextKeyMarker, IsTruncated, Upload} = data;
                    //  由于腾讯云SDK的bug, 查询列表的第一个元素与上一次最后一个元素重复, 因此需要过滤掉UploadId相同的元素
                    _Upload = _Upload.concat(Upload);
                    const UploadIds = _Upload.map(item => item.UploadId);
                    _Upload = _Upload.filter((item, index) => {
                        return UploadIds.indexOf(item.UploadId) == index;
                    });
                    if (IsTruncated == 'true') {
                        params.KeyMarker = NextKeyMarker;
                        _multipartList(params);
                    } else {
                        data.Upload = _Upload;
                        resolve(data);
                    }
                }
            });
        }
        _multipartList(params);
    });
}

/**
 *  放弃分片上传, 作用是清除该 UploadId 下的文件碎片
 *  @param {Object} params  具体参数参考 https://cloud.tencent.com/document/product/436/8629
 *  @return {Promise}
 */
function multipartAbort(params) {
    return new Promise((resolve, reject) => {
        this.multipartAbort(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

module.exports = {
    multipartInit,
    multipartList,
    multipartAbort
}