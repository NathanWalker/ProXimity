var fs = require('fs'),
  path = require('path'),
  utils = require('./lib/utils'),
  Ignore = require('fstream-ignore'),
  fstream = require('fstream');

module.exports = function(grunt){
  'use strict';
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-contrib-manifest');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-contrib');

  //
  // Grunt configuration:
  //
  // https://github.com/cowboy/grunt/blob/master/docs/getting_started.md
  //
  grunt.initConfig({

    // Project configuration
    // ---------------------

    // specify an alternate install location for Bower
    bower: {
      dir: 'app/js/libs'
    },

    // Coffee to JS compilation
    coffee: {
      dist: {
        src: 'js/**/*.coffee',
        dest: 'app/js'
      }
    },

    clean: {
      dist: {
        src: [ 'js/junkfolder' ]
      }
    },

    copy: {
      dist: {
        'app/': 'temp/'
      }
    },

    // compile .less to .css using Recess
    recess: {
      dist: {
        src: 'less/style.less',
        dest: 'css/style.css',
        options: {
          compile: true,
          compress: true
        }
      }
    },

    // generate application cache manifest
    manifest: {
      dist: {
        options: {},
        src: [
          'css/*.css',
          'js/*.js',
          'img/**',
          'views/**',
          '*'
        ],
        dest: 'manifest.appcache'
      }
    },

    // headless testing through PhantomJS
    mocha: {
      all: ['test/**/*.html']
    },

    // default watch configuration
    watch: {
      coffee: {
        files: 'app/<config:coffee.dist.src>',
        tasks: 'coffee reload'
      },
      recess: {
        files: 'app/<config:recess.dist.src>',
        tasks: 'recess reload'
      },
      reload: {
        files: [
          'app/*.html',
          'app/views/**/*.html',
          'app/css/**/*.css',
          'app/js/**/*.js',
          'app/img/**/*'
        ],
        tasks: 'reload'
      }
    },

    // default lint configuration, change this to match your setup:
    // https://github.com/cowboy/grunt/blob/master/docs/task_lint.md#lint-built-in-task
    lint: {
      files: [
        // need to clean up a lot of code before it will pass linting!
        //'js/angular/*.js'
      ]
    },

    // specifying JSHint options and globals
    // https://github.com/cowboy/grunt/blob/master/docs/task_lint.md#specifying-jshint-options-and-globals
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        $: true,
        jQuery: true,
        _: true,
        angular: true,
        Proximity: true,
        ProximityApp: true,
        console: true,
        devLog: true,
        _V_: true // videoJS global
      }
    },

    // Build configuration
    // -------------------

    // the staging directory used during the process
    staging: 'temp',
    // final build output
    output: 'dist',

    mkdirs: {
      staging: 'app/'
    },

    // Below, all paths are relative to the staging directory, which is a copy
    // of the app/ directory. Any .gitignore, .ignore and .buildignore file
    // that might appear in the app/ tree are used to ignore these values
    // during the copy process.

    // concat css/**/*.css files, inline @import, output a single minified css
    css: {
      'css/style.css': ['css/**/*.css']
    },

    // useminPrepare should point to the file containing
    // the usemin blocks to be parsed
    'useminPrepare': {
      html: 'index.html'
    },

    // update references in HTML/CSS to revved files
    usemin: {
      html: ['**/*.html']
    },

    // HTML minification
    html: {
      files: ['**/*.html']
    },

    // Optimizes JPGs and PNGs (with jpegtran & optipng)
    img: {
      dist: 'img/**'
    },

    // usemin updates concat/min blocks
    concat: {},

    min: {}
  });

  grunt.registerTask('build', 'clean mkdirs recess coffee lint useminPrepare concat min usemin manifest copy');
  //TODO: add image optimization into the build, perhaps via: https://github.com/toy/image_optim



  // Override default concat helper from Grunt source to use ';\n' as default concat separator
  // This is necessary because of the way usemin updates the concat config object, it leaves nowhere
  // to put the 'separator' option.
  grunt.registerHelper('concat', function(files, options){
    options = grunt.utils._.defaults(options || {}, {
      separator: ';' + grunt.utils.linefeed
    });
    return files ? files.map(function(filepath){
      return grunt.task.directive(filepath, grunt.file.read);
    }).join(grunt.utils.normalizelf(options.separator)) : '';
  });



  // the following tasks were pulled from the Yeoman internals
  // *********************************************************
  grunt.registerMultiTask('mkdirs', 'Prepares the build dirs', function(){
    this.requires('clean');
    this.requiresConfig('staging');

    // store the current working directory, a subset of tasks needs to update
    // the grunt.file.setBase accordinly on temp/ dir. And we might want
    // chdir back to the original one
    var base = grunt.config('base') || grunt.option('base') || process.cwd();
    grunt.config('base', base);

    var name = this.target,
      target = path.resolve(grunt.config(name)),
      source = path.resolve(this.data),
      cb = this.async();

    // todo a way to configure this from Gruntfile
    //var ignores = ['.gitignore', '.ignore', '.buildignore'];
    var ignores = [];

    grunt.log
      .writeln('Copying into ' + target)
      .writeln('Ignoring ' + grunt.log.wordlist(ignores));


    grunt.helper('copy', source, target, ignores, function(e){
      if (e){
        grunt.log.error(e.stack || e.message);
      } else {
        grunt.log.ok(source + ' -> ' + target);
      }

      // Once copy done, ensure the current working directory is the temp one.
      grunt.file.setBase(grunt.config('staging'));
      cb(!e);
    });
  });

  grunt.registerTask('copy', 'Copies the whole staging (temp/) folder to output (dist/) one', function(){
    this.requiresConfig('staging', 'output');

    var config = grunt.config(),
      cb = this.async();

    // prior to run the last copy step, switch back the cwd to the original one
    // todo: far from ideal, would most likely go into other problem here
    grunt.file.setBase(config.base);

    // todo a way to configure this from Gruntfile
    var ignores = ['.gitignore', '.ignore', '.buildignore'];

    grunt.task.helper('copy', config.staging, config.output, ignores, function(e){
      if (e){
        grunt.log.error(e.stack || e.message);
      } else {
        grunt.log.ok(path.resolve(config.staging) + ' -> ' + path.resolve(config.output));
      }
      cb(!e);
    });
  });

  grunt.registerTask('clean', 'Wipe the previous build dirs', function(){
    this.requiresConfig('staging', 'output');

    var dirs = [grunt.config('staging'), grunt.config('output')];
    dirs.forEach(grunt.task._helpers.rimraf);
  });

  //
  // **rimraf** is the helper wrapper for
  // [rimraf](https://github.com/isaacs/rimraf#readme) package. The
  // given `cb` callback if passed in will make the call asynchronous,
  // otherwise `rimraf.sync` is used.
  //
  grunt.registerHelper('rimraf', function(dir, cb){
    if (typeof cb !== 'function'){
      return utils.rimraf.sync(dir);
    }
    utils.rimraf(dir, cb);
  });

  //
  // **mkdir** helper is basic wrapper around
  // [node-mkdirp](https://github.com/substack/node-mkdirp#readme).
  // Takes a `directory` path to create, process is async if a valid
  // callback function is passed in.
  //
  grunt.registerHelper('mkdir', function(dir, cb){
    if (typeof cb !== 'function'){
      return utils.mkdirp.sync(dir);
    }
    utils.mkdirp(dir, cb);
  });


  //
  // **copy** helper uses [fstream-ignore](https://github.com/isaacs/fstream-ignore)
  // to copy the files under the `src` (usually current directory) to the specified
  // `dest`, optionally ignoring files specified by the `ignores` list of files.
  //
  // It filters out files that match globs in .ignore files throughout the tree,
  // like how git ignores files based on a .gitignore file.
  //
  // This helper is asynchronous only. The whole stream "pipeline" of fstream-
  // ignore is returned so that events might be listen to and further streaming
  // can be done, the result would be the final stream destination instance.
  //
  // The task will "stream" the result of fstream.Ignore to `dest`, which might
  // be a raw writable Stream, or a String in which case a new fstream.Writer is
  // created automatically. If the `dest` string ends with `.tar`, then the copy
  // is done by creating a new/single `.tar` file.
  //
  // - source     - Path to the source directory.
  // - dest       - where the files will be copied to. Can be a String or a
  //                writable Stream. A new fstream.Writer (type directory) is
  //                created is dest is a String.
  // - ignores    - (optional) An Array of ignores files
  // - cb         - callback to call on completion
  //
  //
  grunt.registerHelper('copy', function(src, dest, ignores, cb){
    if (!cb){
      cb = ignores;
      ignores = ['.gitignore', '.ignore', '.buildignore'];
    }

    function error(msg){
      return function(e){
        if (!e){
          grunt.log.writeln();
          return cb();
        }

        grunt.log.error('Oh snap >> ' + msg);
        grunt.log.error(e);
        return cb(false);
      };
    }

    var type = typeof dest !== 'string' ? 'stream' :
      path.extname(dest) === '.tar' ? 'tar' :
        path.extname(dest) === '.tgz' ? 'tgz' :
          'dir';

    var stream = new Ignore({ path: src, ignoreFiles: ignores })
      .on('child', function(c){
        var p = c.path.substr(c.root.path.length + 1);
        grunt.log.verbose.writeln('>>' + p.grey);
        grunt.log.verbose.or.write('.');
      })
      .on('error', error('fstream-ignore reading error'));

    // raw stream pipe it through
    if (type === 'stream'){
      return stream.pipe(dest)
        .on('error', error('pipe error with raw stream'))
        .on('close', error());
    }

    // tar type, create a new "packer": tar.Pack(), zlib.Gzip(), fs.WriteStream
    if (/tar|tgz/.test(type)){
      return grunt.helper('packer', stream, dest, error);
    }

    // dir type, create a new fstream.Writer and let fstream do all the complicated stuff for us
    if (type === 'dir'){
      return stream.pipe(fstream.Writer({
        path: dest,
        type: 'Directory'
      }))
        .on('error', error('pipe error with dir stream'))
        .on('close', error());
    }
  });
};
