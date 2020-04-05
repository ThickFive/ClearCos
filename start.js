const {clear_cos_sync, clear_cos_async} = require('./index');

clear_cos_sync().then(res => {
    console.log(res);
}).catch(err => {
    console.log(err);
})