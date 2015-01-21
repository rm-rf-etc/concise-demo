module.exports = function (grunt) {
    'use strict';
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.initConfig({
        browserify: {
            'dev': {
                'src': './main.js',
                'dest': 'app/scripts/bundle.js',
                'options': {
                    'debug': true,
                    'watch': true,
                    'verbose': true,
                    'open': true
                }
            },
            'release': {
                'src': './main.js',
                'dest': 'app/scripts/bundle.js',
                'options': {
                    'debug': false,
                    'verbose': false
                }
            }
        },
        connect: {
            'devServer': {
                'options': {
                    'base': 'app/',
                    'keepalive': true
                }
            }
        }
    });
    grunt.registerTask('default', [
        'browserify:dev',
        'connect'
    ]);
    grunt.registerTask('release', ['browserify:release']);
};
