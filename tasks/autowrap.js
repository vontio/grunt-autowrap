/*
 * grunt-autowrap
 * https://github.com/vontio/autowrap
 *
 * Copyright (c) 2013 Vontio
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  var path = require('path');
  var _ = grunt.util._;

  grunt.registerMultiTask('autowrap', 'auto wrap and exports for js and coffee class', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      exports:true,
      exportsType:'all',//function,var,all(function + var),filename
      ignoreStartsWith_:true,
      join: true,
      wrapType:'exports',//exports,amd
      coffee:{},
      ext:'js',
      separator: "\n"
    });
    options.isCoffee = options.ext !== 'js';
    grunt.verbose.writeflags(options, 'Options');
    this.files.forEach(function (f) {
      var validFiles = removeInvalidFiles(f);

      if (options.join === true) {
        writeFile(f.dest, concatInput(validFiles, options));
      } else {
        writeFile(f.dest, concatOutput(validFiles, options));
      }
    });
  });
  var removeInvalidFiles = function(files) {
    return files.src.filter(function(filepath) {
      if (!grunt.file.exists(filepath)) {
        grunt.log.warn('Source file "' + filepath + '" not found.');
        return false;
      } else {
        return true;
      }
    });
  };
  var hasUniformExtensions = function(files) {
    // get all extensions for input files
    var ext = files.map(function (f) {
      return path.extname(f);
    });

    if(_.uniq(ext).length > 1) {
      grunt.fail.warn('Join options require input files share the same extension (found '+_.uniq(ext).join(', ')+').');
      return false;
    } else {
      return true;
    }
  };
  var concatInput = function (files, options) {
    if (!hasUniformExtensions(files)) {
      return;
    }

    var code = concatFiles(files, options.separator);
    return autowrap(code, options,files);
  };

  var concatOutput = function(files, options) {
    return files.map(function(filepath) {
      var code = grunt.file.read(filepath);
      return autowrap(code, options, filepath);
    }).join(grunt.util.normalizelf(options.separator));
  };
  var concatFiles = function (files, separator) {
    return files.map(function (filePath) {
      return grunt.file.read(filePath);
    }).join(grunt.util.normalizelf(separator));
  };
  var warnOnEmptyFile = function (path) {
    grunt.log.warn('Destination (' + path + ') not written because compiled files were empty.');
  };

  var writeFile = function (path, output) {
    if (output.length < 1) {
      warnOnEmptyFile(path);
    } else {
      grunt.file.write(path, output);
      grunt.log.writeln('File ' + path + ' created.');
    }
  };
  var addExport = function(code,clazzes){
    if(typeof(clazzes) === 'string')
    {
      return code + 'exports.' + clazzes + '=' + clazzes + ';' + grunt.util.linefeed;
    }else
    {
      return code +
      clazzes.map(function(clazz)
      {
        return 'exports.' + clazz + '=' + clazz + ';';
      }).join(grunt.util.linefeed);
    }
  };
  var addWrap = function(code,options){
    if(options.wrapType === 'exports')
    {
      return '(function(exports){' + grunt.util.linefeed + code + grunt.util.linefeed + "})(exports);";
    }else if(options.wrapType === 'amd')
    {
      return 'define(function(require, exports, module){' + grunt.util.linefeed + code + grunt.util.linefeed + '});';
    }
    return 'unknown options.exportsMethod';
  };
  var autowrap = function(code,options,files){
    if (typeof(files) === 'string')
    {
      files = [files];
    }
    if(options.isCoffee === true)
    {
      code = compileCoffee(code,options.coffee);
    }
    if(options.exports === true)
    {
      if(options.exportsType === 'filename')
      {
        var filenames = [];
        files.map(function(f){
          filenames.push(path.basename(f,'.' + options.ext));
        });
        code = addExport(code,filenames);
      }else
      {
        var ast = getAst(code,options);
        var clazzes = [];
        if(options.exportsType === 'var' || options.exportsType === 'all')
        {
          ast.body.map(function(body){
            if(body.type === 'VariableDeclaration')
            {
              body.declarations.map(function(declaration){
                if(!(options.ignoreStartsWith_ && declaration.id.name.indexOf('_') === 0))//ignore starts with _
                {
                  clazzes.push(declaration.id.name);
                }
              });
            }
          });
        }
        if(options.exportsType === 'function' || options.exportsType === 'all')
        {
          ast.body.map(function(body){
            if(body.type === 'FunctionDeclaration')
            {
              if(!(options.ignoreStartsWith_ && body.id.name.indexOf('_') === 0))//ignore starts with _
              {
                clazzes.push(body.id.name);
              }
            }
          });
        }
        code = addExport(code,clazzes);
      }
    }
    if(options.wrapType !== 'null' && options.wrapType !== null)
    {
      return addWrap(code,options);
    }else
    {
      return code;
    }
  };
  var isLiterate = function (ext) {
    return (ext === ".litcoffee" || ext === ".md");
  };
  var getAst = function(code,opt){
    return require('reflect').parse(code);
  };
  var compileCoffee = function(code,opt) {
    var options = _.clone(opt);
    if(options.bare !== false)
    {
      options.bare = true;
    }
    try {
      return require('coffee-script').compile(code, options);
    } catch (e) {
      if (e.location == null ||
          e.location.first_column == null ||
          e.location.first_line == null) {
        grunt.log.error('Got an unexpected exception ' +
                        'from the coffee-script compiler. ' +
                        'The original exception was: ' +
                        e);
        grunt.log.error('(The coffee-script compiler should not raise *unexpected* exceptions. ' +
                        'You can file this error as an issue of the coffee-script compiler: ' +
                        'https://github.com/jashkenas/coffee-script/issues)');
      } else {
        var firstColumn = e.location.first_column;
        var firstLine = e.location.first_line;
        var codeLine = code.split('\n')[firstLine];
        var errorArrows = '\x1B[31m>>\x1B[39m ';
        var offendingCharacter;

        if (firstColumn < codeLine.length) {
          offendingCharacter = '\x1B[31m' + codeLine[firstColumn] + '\x1B[39m';
        } else {
          offendingCharacter = '';
        }

        grunt.log.error(e);
        //grunt.log.error('In file: ' + filepath);
        grunt.log.error('On line: ' + firstLine);
        // Log erroneous line and highlight offending character
        // grunt.log.error trims whitespace so we have to use grunt.log.writeln
        grunt.log.writeln(errorArrows + codeLine.substring(0, firstColumn) +
                          offendingCharacter + codeLine.substring(firstColumn + 1));
        grunt.log.writeln(errorArrows + grunt.util.repeat(firstColumn, ' ') +
                          '\x1B[31m^\x1B[39m ');
      }
      grunt.fail.warn('CoffeeScript failed to compile.');
    }
  };
};
