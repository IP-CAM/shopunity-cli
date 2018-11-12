const axios = require('axios');
const config = require('../lib/config');
const Helper = require('../lib/helper');
const projectDir = process.cwd();

module.exports = async function(codename, version) {

    await config.load();
    const version_url = '';
    if (version) {
        version_url = "&version=" + version;
    }
    axios.get(config.api_url + 'extensions?codename=' + codename)
        .then(response => {
            if (response.data[0]) {
                var extension = response.data[0];
                console.log('Installing ' + extension.name + '...');

                axios.get(config.api_url + 'extensions/' + extension.extension_id + '/download?store_version=' + config.project.store_version + version_url)
                    .then(response => {
                        if (response.data.download) {
                            var download_url = response.data.download;
                            Helper.download(download_url).then(downloadFile => {
                                Helper.extract(downloadFile, projectDir)
                                config.addRequired(extension.codename, extension.version);
                            })

                        } else if (response.data.errors) {
                            console.log(response.data.errors);
                        } else {
                            console.log('Sorry, there is no download url.');
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
                // console.log(response.data.explanation);  
            } else {
                console.log('Sorry, we did not find ' + codename + ' on Shopunity.');
            }
        })
        .catch(error => {
            console.log(error);
        });
};