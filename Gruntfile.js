/*!
 *  Gruntfile.js configuration
 */

'use strict';

module.exports = function ( grunt ) {

    /*
     * Dynamically load the npm tasks
     */
    // require( 'matchdep' ).filterDev('grunt-*').forEach( grunt.loadNpmTasks );

    /*
     * Grunt init
     */
    grunt.initConfig({

        /*
         * Grunt JSON for project
         */
        pkg: grunt.file.readJSON( 'package.json' ),

        /*
         * Credit banner
         */
        tag: {
            banner: "/*!\n" +
                    " *  <%= pkg.name %>\n" +
                    " *  @version <%= pkg.version %>\n" +
                    " *  @author <%= pkg.author %>\n" +
                    // " *  Project: <%= pkg.homepage %>\n" +
                    " *\n" +
                    " *  <%= pkg.description %>\n" +
                    // " *  Copyright <%= pkg.year %>." +
                    // " <%= pkg.licenses[0].type %> licensed.\n" +
                    " */\n"
        },

        /*
         * jsHint
         */
        jshint: {
            files: [
                "src/app/**/*.js",
                "!src/app/reports/*.js",
                "src/lib/weighted-overlay-modeler/**/*.js"
            ],
            options: {
                jshintrc: ".jshintrc"
            }
        },

        /*
         * Concat
         */
        // concat: {
        //     dist: {
        //         src: ["src/psswrd.js"],
        //         dest: "dist/psswrd.js"
        //     },
        //     options: {
        //         banner: "<%= tag.banner %>"
        //     }
        // },

        // * clean
        clean: ["dist"],

        //  * UglifyJS

        uglify: {
            dynamic_mappings: {
              // Grunt will search for "**/*.js" under "lib/" when the "minify" task
              // runs and build the appropriate src-dest file mappings then, so you
              // don't need to update the Gruntfile when files are added or removed.
              files: [
                {
                  expand: true,     // Enable dynamic expansion.
                  cwd: 'src',      // Src matches are relative to this path.
                  src: ['**/*.js','!tests/**','!app/config.js'], // Actual pattern(s) to match.
                  dest: 'dist/',   // Destination path prefix.
                  ext: '.js'   // Dest filepaths will have this extension.
                }
              ]
            },
            options: {
                banner: "<%= tag.banner %>"
            }
        },

        // copy html/css files

        copy: {
            main: {
              files: [
                // copy src html/css/image files to dist,
                // but not tests
                {
                  expand: true,     // Enable dynamic expansion.
                  cwd: 'src',      // Src matches are relative to this path.
                  src: ['**/*.html','**/*.css','**/images/*','**/img/*','!tests/**'], // Actual pattern(s) to match.
                  dest: 'dist/'   // Destination path prefix.
                }
              ]
            },
            local: {
              files: [
                // copy the local config file unminified
                {
                  expand: true,     // Enable dynamic expansion.
                  cwd: 'src',      // Src matches are relative to this path.
                  src: ['app/config.js','proxy*'], // Actual pattern(s) to match.
                  dest: 'dist/'   // Destination path prefix.
                }

              ]
            },
            dev: {
              files: [
                // copy dev config file unminified
                {
                  expand: true,     // Enable dynamic expansion.
                  cwd: 'src',      // Src matches are relative to this path.
                  src: ['app/config.dev'], // Actual pattern(s) to match.
                  dest: 'dist/',   // Destination path prefix.
                  ext: '.js'
                }
              ]
            },
            africa: {
              files: [
                // copy dev config file unminified
                {
                  expand: true,     // Enable dynamic expansion.
                  cwd: 'src',      // Src matches are relative to this path.
                  src: ['app/config.africa','proxy*'], // Actual pattern(s) to match.
                  dest: 'dist/',   // Destination path prefix.
                  ext: '.js'
                }
              ]
            },
            // needed for single file build
            single: {
              files: [
                // single file build doesn't copy over nls
                {expand: true, cwd: 'src/app/', src:['nls/**'], dest: 'dist/app/'},
                // TODO: remove this and use requirejs:css to minify and inline CSS into single file
                {expand: true, cwd: 'src/lib', src:['bootstrap_v2/**'], dest: 'dist/lib'},
                {expand: true, cwd: 'src/lib/weighted-overlay-modeler/widget', src:['resources/**'], dest: 'dist/lib/weighted-overlay-modeler/widget'},
                {expand: true, cwd: 'src/app', src:['css/**'], dest: 'dist/app'},
                {expand: true, cwd: 'src/app/reports', src:['css/**'], dest: 'dist/app/reports'},
                {expand: true, cwd: 'src', src: ['proxy*'], dest: 'dist/' }
                // r.js doesn't copy background image paths that it traces through url()
                // {expand: true, cwd: 'src/js/app/wijit/resources/', src:['img/**'], dest: 'dist/js/app/wijit/resources/'}
              ]
            }
        },

        requirejs: {
          // configuration for a multi-file build
          compile: {
            options: {
              baseUrl: '.',
              appDir: 'src',
              dir: 'dist',
              paths: {
                'esri': 'empty:',
                'dojo': 'empty:',
                'dojox': 'empty:',
                'dijit': 'empty:'
              },
              optimize: 'uglify2'
            }
          },
          // configuration for a single-file build
          single: {
            options: {
              baseUrl: 'src',
              name: 'main',
              out: 'dist/main-built.js',
              paths: {
                'esri': 'empty:',
                'dojo': 'empty:',
                'dojox': 'empty:',
                'dijit': 'empty:',
                'dgrid': 'empty:',
                'modeler': 'lib/weighted-overlay-modeler',
                'text': '../deps/text/text',
                'domReady': '../deps/domReady/domReady',
                'i18n': '../deps/i18n/i18n'
              },
              exclude: ['esri', 'dojo', 'dojox', 'dijit', 'dgrid', 'text', 'domReady', 'i18n'],
              inlineText: true,
              // NOTE: this does not work
              // locale: "es",
              optimize: 'uglify2'
            }
          },
          // used in single file build to optimize static resources such as css images
          css: {
            options: {
              cssIn: 'src/css/app.css',
              out: 'dist/css/app.css'
            }
          }
        },

        replace: {
          // needed for inlined templated in single-file build
          "main-built": {
            src: ['dist/main-built.js'],
            dest: 'dist/main-built.js',
            replacements: [{
              from: 'text!',
              to: ''
            }]
          },
          // replace reference to main file for single file build
          index: {
            src: ['src/index.html'],
            dest: 'dist/index.html',
            replacements: [{
              from: 'main.js',
              to: 'main-built.js'
            },
            // set locale to test i18n
            {
              from: '// locale:',
              to: 'locale:'
            }]
          }
        }


    });

    // Load the plugin that provides the "jshint" task.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-text-replace');

    /*
     * Register tasks
     */
    grunt.registerTask("default", [
        "jshint",
        // "concat",
        'clean',
        "uglify",
        "copy:main",
        "copy:local"
    ]);

    grunt.registerTask("dev", [
        "jshint",
        // "concat",
        'clean',
        "uglify",
        "copy:main",
        "copy:dev"
    ]);

    grunt.registerTask("africa", [
        "jshint",
        // "concat",
        'clean',
        "uglify",
        "copy:main",
        "copy:africa"
    ]);

    grunt.registerTask("hint", ["jshint"]);

    grunt.registerTask("compile", ["requirejs:compile"]);
    grunt.registerTask("single", ["clean", "requirejs:single", "replace", /*"requirejs:css", */"copy:single"]);

};