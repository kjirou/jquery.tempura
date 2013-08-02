module.exports = (grunt) ->

  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-notify'
  grunt.loadNpmTasks 'grunt-testem'
  grunt.loadNpmTasks 'grunt-text-replace'

  grunt.initConfig

    pkg: grunt.file.readJSON 'package.json'

    constants:
      js:
        src: 'jquery.tempura.js'
        test: 'development/assets/mocha-tests.js'
      jqueries: [
        'assets/jquery-1.10.2.min.js'
        'assets/jquery-1.9.1.min.js'
        'assets/jquery-1.8.3.min.js'
        'assets/jquery-2.0.3.min.js'
      ]
      index: 'development/index.html'
      builded:
        js:
          minified: 'jquery.tempura.min.js'
        jq_test_runners: [
          'development/jquery-1.10.2.html'
          'development/jquery-1.9.1.html'
          'development/jquery-1.8.3.html'
          'development/jquery-2.0.3.html'
        ]

    uglify:
      production:
        files:
          '<%= constants.builded.js.minified %>': '<%= constants.js.src %>'

    testem:
      _dest: 'log/tests.tap'

      options:
        launch_in_ci: ['PhantomJS']

      main:
        src: '<%= constants.index %>'
        dest: '<%= testem._dest %>'

      xb:
        options:
          launch_in_ci: [
            'PhantomJS'
            'Chrome'
            'Firefox'
            'Safari'
          ]
        src: '<%= constants.index %>'
        dest: '<%= testem._dest %>'

      all:
        options:
          launch_in_ci: [
            'PhantomJS'
            'Chrome'
            'Firefox'
            'Safari'
          ]
        src: '<%= constants.builded.jq_test_runners %>'
        dest: '<%= testem._dest %>'

      travis:
        src: '<%= constants.builded.jq_test_runners %>'

    copy:
      jq_test_runners:
        files: [
          src: '<%= constants.index %>'
          dest: '<%= constants.builded.jq_test_runners[grunt.task.current.args[0]] %>'
        ]

    replace:
      version:
        src: [
          'package.json'
          '<%= constants.js.src %>'
        ]
        overwrite: true
        replacements: [
          from: /(['"])0\.0\.0(['"])/
          to: '$10.0.0$2'
        ]
      jq_test_runners:
        src: '<%= constants.builded.jq_test_runners[grunt.task.current.args[0]] %>'
        overwrite: true
        replacements: [
          from: /(<script src=")assets\/jquery-1\.10\.2.min\.js(">)/
          to: '$1<%= constants.jqueries[grunt.task.current.args[0]] %>$2'
        ]

    jshint:
      options:
        jshintrc: '.jshintrc'
      files: [
        '<%= constants.js.src %>'
        '<%= constants.js.test %>'
      ]


  # Task sets
  grunt.registerTask 'testall', [
    'copy:jq_test_runners:0'
    'copy:jq_test_runners:1'
    'copy:jq_test_runners:2'
    'copy:jq_test_runners:3'
    'replace:jq_test_runners:0'
    'replace:jq_test_runners:1'
    'replace:jq_test_runners:2'
    'replace:jq_test_runners:3'
    'testem:all'
  ]

  grunt.registerTask 'travis', [
    'copy:jq_test_runners:0'
    'copy:jq_test_runners:1'
    'copy:jq_test_runners:2'
    'copy:jq_test_runners:3'
    'replace:jq_test_runners:0'
    'replace:jq_test_runners:1'
    'replace:jq_test_runners:2'
    'replace:jq_test_runners:3'
    'testem:travis'
  ]

  grunt.registerTask 'release', [
    'jshint'
    'replace:version'
    'uglify:production'
  ]

  # Aliases
  grunt.registerTask 'test', 'testem:main'
  grunt.registerTask 'travis', 'testem:travis'


  # Shortcuts
  grunt.registerTask 'default', 'test'
  grunt.registerTask 'h', 'jshint'
