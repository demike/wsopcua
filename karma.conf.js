// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  return config.set({
    basePath: '',
    frameworks: ['jasmine', 'karma-typescript', 'source-map-support'],

    files: [
      { pattern: 'src/**/*.ts', esModule: true },
      { pattern: 'src/**/*.fixture', included: false, watched: false, served: true },
      //      { pattern: "src/**/schema_parser/bin/**", included: false, watched: false},
      //      { pattern: "src/**/*.d.ts", included: false, watched: false},
      //      { pattern: "src/schema_parser/**", included: false, watched: false},
      //      { pattern: "src/**/node_modules/*", included: false, watched: false}
    ],
    exclude: ['src/**/*.d.ts', 'src/**/schema_parser/**', 'src/**/node_modules/**'],
    preprocessors: {
      'src/**/*.ts': ['karma-typescript'],
    },
    karmaTypescriptConfig: {
      tsconfig: './tsconfig.json',

      compilerOptions: {
        //noEmitOnError: true,
        module: 'commonjs',
        target: 'ES2015',
      },

      coverageOptions: {
        exclude: [/\.(d|spec|e2e-spec)\.ts$/i, /(generated)/, /(tcp_transport)/, /(constants)/],
        instrumentation: false,
      },

      bundlerOptions: {
        entrypoints: /\.spec\.ts$/,
        // transforms: [require('karma-typescript-es6-transform')()],
      },

      exclude: ['src/**/node_modules', 'src/schema_parser/**/*'],
    },
    /*
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-jasmine-html-reporter',
      'karma-coverage-istanbul-reporter',
      'karma-typescript',
      'karma-source-map-support',
    ],
*/
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },

    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, './coverage'),
      reports: ['html', 'lcovonly'],
      fixWebpackSourcePaths: true,
    },

    reporters: ['verbose', 'kjhtml', 'karma-typescript'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    restartOnFileChange: true,
    singleRun: false,
  });
};
