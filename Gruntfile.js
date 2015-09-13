/*
 * open http://localhost:3000/ in your browser.
 */

module.exports = function(grunt){
  'use strict'
  require('load-grunt-tasks')(grunt)
  grunt.initConfig({
    watch:{
      source:{
        files: ['main.js', 'node_modules/concise/**/*.js', 'node_modules/app/**/*.js'],
        tasks: ['browserify']
      },
      // browsersync:{
      //   files: ['Gruntfile.js'],
      //   tasks: ['default']
      // }
    },
    browserify:{
      dev:{
        src: './node_modules/app/client/main.js',
        dest: 'public/scripts/bundle.js',
        options:{
          debug: true,
          watch: false,
          verbose: true,
          open: true
        }
      },
      release:{
        src: './node_modules/app/client/main.js',
        dest: 'public/scripts/bundle.js',
        options:{
          debug: false,
          verbose: false
        }
      }
    },
    browserSync:{
      bsFiles:{
        src: ['public/styles/*', 'public/index.html', 'public/scripts/bundle.js']
      },
      options:{ // open http://localhost:3002/ in your browser.
        open: false,
        watchTask: true,
        server:{
          baseDir: './public',
          middleware: require('app/server/routing')
        }
      }
    }
  })
  grunt.registerTask('default', ['browserify:dev', 'browserSync', 'watch'])
  grunt.registerTask('release', ['browserify:release'])
}
