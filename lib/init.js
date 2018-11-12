const axios = require('axios');
const config = require('../lib/config');


module.exports = function(inputs) {
    config.save(inputs);
};