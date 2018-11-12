const fs = require('fs');
const path = require('path');
const projectDir = process.cwd();
const configFilePath = path.resolve(projectDir, 'shopunity.json');
const Helper = require('../lib/helper');
const version = '0.0.1';

const config = {
    state: false,
    version: version,
    api_url: 'https://api.shopunity.net/v1/',
    project: {
        store_version: '',
        codename: '',
        name: '',
        version: '',
        required: {},
        scripts: {}
    },
    save: function(project_config) {
        this.project = Object.assign(this.project, project_config);

        fs.writeFile(configFilePath, JSON.stringify(this.project, null, 4), function(err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
    },
    addRequired: function(codename, version) {
        this.project.required[codename] = '>=' + version;
        fs.writeFile(configFilePath, JSON.stringify(this.project, null, 4), function(err) {
            if (err) {
                return console.log(err);
            }
            console.log("shopunity.json updated!");
        });
    },
    load: function() {
        if (!this.state) {
            fs.readFile(configFilePath, 'utf8', function(err, contents) {
                if (!err) {
                    this.state = true;
                    this.project = JSON.parse(contents);
                } else {
                    console.log(err)
                }
            }.bind(this))
        } else {
            console.log('Please, run "shopunity init" first.')
        }
    }

    // init: function() {
    //     if (!this.state) {
    //         fs.readFile(configFilePath, 'utf8', function(err, contents) {
    //             if (!err) {
    //                 this.state = true;
    //                 this.project = JSON.parse(contents);
    //                 if (this.project.required) {
    //                     for (var codename in this.project.required) {
    //                         var version = this.project.required[codename];
    //                         Helper.installExtension(codename, version);
    //                     }
    //                 }
    //             } else {
    //                 console.log(err)
    //             }
    //         }.bind(this))
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }

}
module.exports = config