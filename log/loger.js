const log4js = require('log4js');
const path = require('path');

/**
 *  日志输出配置
 *  1). appenders: ['ClearCosLoger', 'TestLoger', 'console'] 会导致控制台与日志文件中2次重复输出
 *  2). appenders: ['console'] 无日志文件输出
 *  3). 因为以上两点的原因, 最终写成如下形式能正常工作
 *  categories: {
        default: { 
            appenders: ['ClearCosLoger', console'], 
            level: 'debug'
        } 
    }
 */
log4js.configure({
    appenders: { 
        ClearCosLoger: { 
            type: 'file',
            filename: path.resolve(__dirname, 'clear-cos.log')
        },
        TestLoger: { 
            type: 'file',
            filename: path.resolve(__dirname, 'clear-cos.log')
        },
        console: {
            type: 'console',
        } 
    },
    categories: {
        default: { 
             appenders: ['ClearCosLoger', 'console'], 
             level: 'debug'
        } 
    }
});
const LOG = log4js.getLogger('ClearCosLoger');
const TestLoger = log4js.getLogger('TestLoger');

module.exports = {LOG, TestLoger};