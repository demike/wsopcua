// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html


const getBaseKarmaConfig = require('./karma.conf');

module.exports = function(config) {
    getBaseKarmaConfig(config);
    config.karmaTypescriptConfig.bundlerOptions.entrypoints = /\.e2e-spec\.ts$/;
 
};
