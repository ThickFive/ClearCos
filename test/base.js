/**
 *  在 createbucket.js createfragmentation.js createobject.js 中共同引用的基础配置
 *  以便基于同样一套命名规则批量生成测试用的存储桶、文件以及文件碎片
 */
module.exports = {
    Bucket: 'base-bucket-name',
    Region: 'ap-guangzhou',
    Key: 'base-file-name'
}