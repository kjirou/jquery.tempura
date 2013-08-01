module.exports = (grunt) ->

  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-concat'
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
        src: '<%= pkg.main %>'
        test: 'development/assets/mocha-tests.js'
      jqueries: [
        'development/assets/vendor/jquery-2.0.3.min.js'
        'development/assets/vendor/jquery-1.10.2.min.js'
        'development/assets/vendor/jquery-1.9.1.min.js'
        'development/assets/vendor/jquery-1.8.3.min.js'
      ]
      builded:
        js:
          minified: 'jquery.tempura.min.js'

    uglify:
      production:
        files:
          '<%= constants.builded.js.minified %>': '<%= constants.js.src %>'

    testem:
      _src: 'development/index.html'
      _dest: 'log/tests.tap'

      options:
        launch_in_ci: ['PhantomJS']

      main:
        src: '<%= testem._src %>'
        dest: '<%= testem._dest %>'

      xb:
        options:
          launch_in_ci: [
            'PhantomJS'
            'Chrome'
            'Firefox'
            'Safari'
          ]
        src: '<%= testem._src %>'
        dest: '<%= testem._dest %>'

      travis:
        src: '<%= testem._src %>'

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

    jshint:
      options:
        jshintrc: '.jshintrc'
      files: [
        '<%= constants.js.src %>'
        '<%= constants.js.test %>'
      ]


  # Task sets
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
