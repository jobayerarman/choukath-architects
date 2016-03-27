module.exports = function(grunt) {

  // Load the plugins
  require('load-grunt-tasks')(grunt);

  //mozjpeg is a production-quality JPEG encoder that improves compression while maintaining compatibility with the vast majority of deployed decoders
  var mozjpeg = require('imagemin-mozjpeg');

  // constants for various paths and files to be used by the task configuration
  /* Source Directories */
  // Source Base
  var SRC_DIR            = "src/";

  // HTML base source
  var SRC_DIR_HTML       = SRC_DIR + "site/";
  // Include base source
  var SRC_DIR_INCLUDE    = SRC_DIR_HTML + "include";
  // Source HTML files
  var SRC_FILES_HTML     = [SRC_DIR_HTML + "*.html", SRC_DIR_HTML + "pages/*.html", SRC_DIR_HTML + "include/*.html"];

  // Source Directory
  var SRC_DIR_JS         = SRC_DIR + "js/";
  var SRC_DIR_CSS        = SRC_DIR + "css/";
  var SRC_DIR_LESS       = SRC_DIR + "less/";

  // Source files
  var SRC_FILES_JS       = SRC_DIR_JS   + "*.js";
  var SRC_FILES_CSS      = SRC_DIR_CSS  + "*.css";
  var SRC_FILES_LESS_ALL = SRC_DIR_LESS + "**/*.less";

  // Browser prefix for Autoprefixing
  var AP_BROWSERS = [
  "Android >= 4",
  "Chrome >= 35",
  "Firefox >= 35",
  "Explorer >= 7",
  "iOS >= 6",
  "Opera >= 20",
  "Safari >= 9"
  ];

  /* Output Directories */
  // Destination Base
  var BUILD_DIR       = "dist/";

  // Stylesheet Sources
  var BUILD_DIR_CSS   = BUILD_DIR     + "css/";
  var BUILD_FILE_CSS  = BUILD_DIR_CSS + "style.min.css";
  var BUILD_FILES_CSS = BUILD_DIR_CSS + "*.css";

  // JavaScripts Sources
  var BUILD_DIR_JS    = BUILD_DIR     + "js/";
  var BUILD_FILE_JS   = BUILD_DIR_JS  + "script.js";
  var BUILD_FILES_JS  = BUILD_DIR_JS  + "*.js";


  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // clean each destination before output
    clean: {
      html: ["dist/**/*.html"],
      css: [SRC_FILES_CSS, BUILD_FILES_CSS],
      js : [BUILD_FILES_JS]
    },

    // Build the site using grunt-includes
    includes: {
      build: {
        cwd: SRC_DIR_HTML,
        src: [ "*.html", "pages/*.html" ],
        dest: BUILD_DIR,
        options: {
          flatten: true,
          duplicates: false,
          includePath: SRC_DIR_INCLUDE
        }
      }
    },

    // Changes the path using grunt-processhtml
    processhtml: {
      dist: {
        expand: true,
        cwd: BUILD_DIR,
        src: ['**/*.html'],
        dest: BUILD_DIR
      }
    },

    // all in one processor of the LESS to CSS
    cssflow: {
      options: {
        preprocessor: 'less',
        autoprefixer: {
          browsers: AP_BROWSERS
        }
      },
      build: {
        files: {
          'src/css/style.css': 'src/less/main.less'
        }
      }
    },

    // copy CSS from source directory to dist folder
    copy: {
      styles: {
        expand: true,
        cwd: SRC_DIR_CSS,
        src: ['*.css'],
        dest: BUILD_DIR_CSS
      }
    },

    // remove unused CSS selector
    uncss: {
      build: {
        files: [
          {
            src: 'index.html',
            dest: 'dist/css/style.uncss.css'
          }
        ],
        options: {
          ignoreSheets: [/fonts.googleapis/]
        }
      }
    },

    // Validate files with JSHint
    jshint: {
      options: {
        reporter: require('jshint-stylish'),
        curly: true,
        globals: {
          jQuery: true
        }
      },
      beforeconcat: [SRC_FILES_JS],
      afterconcat: [BUILD_FILE_JS]
    },

    // Concatenate javascript files
    concat: {
      options: {
        seperator: ";"
      },
      build: {
        src: [SRC_FILES_JS],
        dest: BUILD_FILE_JS
      }
    },

    // Minify files with UglifyJS
    uglify: {
      build: {
        files: {
          'dist/js/script.min.js': 'dist/js/script.js'
        }
      }
    },

    // Minify images
    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: 'src/images/',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'dist/images/'
        }],
        options: {
          optimizationLevel: 3,
          progressive: true,
          svgoPlugins: [{ removeViewBox: false }],
          use: [mozjpeg({quality: 70})]
        }
      }
    },

    watch: {
      configFiles: {
        options: {
          reload: true
        },
        files: [ 'Gruntfile.js'],
      },
      html: {
        options: {
          spawn: false
        },
        files: SRC_FILES_HTML,
        tasks: ['includes']
      },
      styles: {
        options: {
          spawn: false
        },
        files: [SRC_FILES_LESS_ALL],
        tasks: ['cssflow', 'copy']
      },
      scripts: {
        options: {
          spawn: false
        },
        files: ['src/js//*.js'],
        tasks: ['jshint:beforeconcat', 'clean:js', 'concat', 'uglify', 'jshint:afterconcat']
      }
    }
  });

  //Default Task(s)
  grunt.registerTask('default', ['includes', 'clean:css', 'cssflow', 'copy:styles']);

  // Production tasks
  grunt.registerTask('dev', ['includes', 'clean:css', 'cssflow', 'copy:styles', 'watch']);
  // Build Tasks changes path variables for uploading
  grunt.registerTask('build', ['includes', 'processhtml']);

  // Image compressing task
  grunt.registerTask('compress', ['newer:imagemin']);
  // Remove unused css class
  grunt.registerTask('cleancss', ['uncss', 'cssmin:dist']);
};
