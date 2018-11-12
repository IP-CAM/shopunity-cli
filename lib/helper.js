const Fs = require('fs')
const Path = require('path')
const Axios = require('axios')
const Unzipper = require('unzipper')
const mkdirp = require('mkdirp')
const _cliProgress = require('cli-progress')
var progress = require('progress-stream');
const config = require('../lib/config');

const Helper = {
    download: async function(url) {
        const path = Path.resolve(__dirname, '../', 'files', 'download.zip')
        const bar = new _cliProgress.Bar({}, _cliProgress.Presets.shades_classic)


        const response = await Axios({
            method: 'GET',
            url: url,
            responseType: 'stream'
        })
        bar.start(100, 0);
        const str = progress({
            length: response.data.headers['content-length'],
            time: 100 /* ms */
        });

        str.on('progress', function(progress) {
            bar.update(progress.percentage)
        });

        response.data
            .pipe(str)
            .pipe(Fs.createWriteStream(path))

        return new Promise(function(resolve, reject) {
            response.data.on('end', function() {
                Fs.readFile(path, 'utf8', function(err, contents) {
                    if (!this.isJsonString(contents)) {
                        bar.stop();
                        resolve(path);
                    } else {
                        bar.update(0)
                        bar.stop();
                        var error = JSON.parse(contents);
                        console.log("ERROR! " + error.error)
                    }
                }.bind(this));
            }.bind(this))

            response.data.on('error', function(err) {
                reject(err);
                bar.stop();
            })
        }.bind(this))
    },

    extract: async function(file, dest) {
        Fs.createReadStream(file)
            .pipe(Unzipper.Parse())
            .on('entry', function(entry) {
                var fileName = entry.path;
                var type = entry.type; // 'Directory' or 'File'
                var size = entry.size;
                if (fileName.startsWith('upload/')) {
                    var filePath = dest + '/' + fileName.replace('upload/', '');
                    mkdirp(filePath.substring(0, filePath.lastIndexOf("/")), function(err) {
                        if (err) console.error(err)
                        else entry.pipe(Fs.createWriteStream(filePath))
                    });

                } else {
                    entry.autodrain();
                }
            });
    },
    isJsonString: function(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
}

module.exports = Helper