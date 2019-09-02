'use strict';
/* eslint-env node */
var fs = require('fs');
var gulp = require('gulp');
// var concat = require('gulp-concat');
var del = require('del');
// var gulpLoadPlugins = require('gulp-load-plugins');
// var plugins = gulpLoadPlugins();
// var runSequence = require('run-sequence');
var rollup = require('rollup');
var merge2 = require('merge2');
var debug = require('gulp-debug');
var inject = require('gulp-inject');
var plumber = require('gulp-plumber');
var terser = require('gulp-terser');
var rollupResolve = require('rollup-plugin-node-resolve');
var rollupBabel = require('rollup-plugin-babel');
var jscadFiles = require('gulp-jscad-files');
var pkg = require('./package.json');

gulp.task('build', async function() {
  const bundle = await rollup.rollup({
    input: './src/index.js',
    external: ['@jscad/scad-api', '@jscad/csg', '@jwc/jscad-utils'],
    plugins: [
      rollupResolve({
        customResolveOptions: {
          moduleDirectory: 'node_modules'
        },
        browser: true
      }),
      rollupBabel({
        exclude: 'node_modules/**' // only transpile our source code
      })
    ]
  });

  await bundle.write({
    name: 'jscadHardware',
    file: 'dist/index.js',
    format: 'iife',
    exports: 'named',
    globals: {
      '@jscad/csg': 'jsCadCSG',
      '@jscad/scad-api': 'scadApi',
      '@jwc/jscad-utils': 'jscadUtils'
    },
    banner: `/* 
 * ${pkg.name} version ${pkg.version} 
 * ${pkg.homepage}
 */`,
    footer: `/* ${pkg.name} follow me on Twitter! @johnwebbcole */`
  });
});

gulp.task('v1compat', function() {
  return gulp
    .src('src/v1compat.js')
    .pipe(plumber())
    .pipe(
      inject(gulp.src('dist/index.js').pipe(debug({ title: 'injecting:' })), {
        relative: true,
        starttag: '// include:compat',
        endtag: '// end:compat',
        transform: function(filepath, file) {
          return '// ' + filepath + '\n' + file.contents.toString('utf8');
        }
      })
    )
    .pipe(gulp.dest('dist'));
});

// gulp.task('clean', function(done) {
//   del(['README.md', 'dist/*.jscad']).then(paths => {
//     console.log('Deleted files and folders:\n', paths.join('\n')); // eslint-disable-line no-console, no-undef
//     done();
//   });
// });

// gulp.task('lint', function() {
//   return gulp
//     .src(['*.jscad', 'gulpfile.js'])
//     .pipe(plugins.plumber())
//     .pipe(plugins.eslint())
//     .pipe(plugins.eslint.format());
//   // .pipe(plugins.eslint.failAfterError());
// });

// gulp.task('docs', function() {
//   return gulp
//     .src('*.jscad')
//     .pipe(plugins.plumber())
//     .pipe(plugins.concat('README.md'))
//     .pipe(
//       plugins.jsdocToMarkdown({
//         template: fs.readFileSync('./jsdoc2md/README.hbs', 'utf8')
//       })
//     )
//     .on('error', function(err) {
//       plugins.util.log('jsdoc2md failed:', err.message);
//     })
//     .pipe(gulp.dest('.'));
// });

gulp.task('examples', function() {
  return gulp
    .src('examples/*.jscad')
    .pipe(plumber())
    .pipe(
      inject(
        merge2(
          gulp
            .src('package.json')
            .pipe(jscadFiles())
            .pipe(
              terser({
                ecma: 6,
                keep_fnames: true,
                mangle: false,
                compress: false,
                output: {
                  beautify: true,
                  max_line_len: 80
                }
              })
            ),
          gulp.src(['dist/v1compat.js'])
        ).pipe(debug({ title: 'injecting:' })),
        {
          relative: true,
          starttag: '// include:js',
          endtag: '// endinject',
          transform: function(filepath, file) {
            return '// ' + filepath + '\n' + file.contents.toString('utf8');
          }
        }
      )
    )
    .pipe(gulp.dest('dist/examples'));
});

// gulp.task('github-page', ['docs', 'examples'], function() {
//   return gulp
//     .src('package.json')
//     .pipe(plugins.plumber())
//     .pipe(
//       plugins.openjscadStandalone({
//         filename: 'bolt.jscad',
//         filepath: __dirname + '/dist/bolt.jscad'
//       })
//     )
//     .pipe(gulp.dest('docs'));
// });

gulp.task('all', gulp.series(['build', 'v1compat', 'examples']));

gulp.task(
  'default',
  gulp.series(['build', 'v1compat', 'examples'], function() {
    gulp.watch(
      ['src/**/*.js', 'examples/*.jscad'],
      {
        verbose: true,
        followSymlinks: true,
        delay: 500,
        queue: false,
        ignoreInitial: false,
        ignored: ['**/*.*~', 'dist/*', '.vuepress/*']
      },
      gulp.series(['build', 'v1compat', 'examples'])
    );
  })
);
