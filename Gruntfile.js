// Generated on 2013-127.0.0.1-09 using generator-angular 0.6.0
'use strict';
var now = new Date();
var os = require('osenv');

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {

    // TODO: Add logic to read nexus authentication details from user config file.
    // grunt.log.writeln(os.home());

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Load tasks for stubby - our mock api server
    grunt.loadNpmTasks('grunt-stubby');

    // Load tasks for reverse proxy. So that webapp and mock api server are on same address & port.
    // Circumvents CORS restrictions
    grunt.loadNpmTasks('grunt-connect-proxy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-connect-rewrite');

    // Grunt text replace to sub in environment values
    grunt.loadNpmTasks('grunt-text-replace');

    // Creating a WAR of your project for deployment
    grunt.loadNpmTasks('grunt-war');

    // get Git commit id
    grunt.loadNpmTasks('grunt-git-rev-parse');

    // Define the configuration for all the tasks
    grunt.initConfig({
        // Configuration for string replace to sub in values for correct environment
        replace: {
            disableLoggingInProduction: {
                src: ['.tmp/concat/scripts/scripts.js'], // source files array (supports minimatch)
                dest: '.tmp/concat/scripts/', // destination directory or file
                replacements: [{
                        from: '$logProvider.debugEnabled(true);',
                        to: '$logProvider.debugEnabled(false);'
                    }]
            },
            insertMultiVersionNumbers: {
                src: [
                    '<%= yeoman.dist %>/**/*.html',
                    '<%= yeoman.dist %>/**/*.js'
                ], // all *.html and *.js within dirs/sub dirs
                overwrite: true, // overwrite *.html in the dist dir
                replacements: [{
                    from: '__APPVERSION__',
                    to: '<%= yeoman.versionWithBuildNumberAndGitCommitId %>'
                }]
            }
        },
        less: {
            development: {
                files: {
                    "app/styles/macquarie.css": "app/styles/less/macquarie-overrides.less",
                    "app/styles/brandX.css": "app/styles/less/brandX-overrides.less"
                }
            },
            production: {
                options: {
                    cleancss: true
                },
                files: {
                    "app/styles/macquarie.min.css": "app/styles/less/macquarie-overrides.less",
                    "app/styles/brandX.min.css": "app/styles/less/brandX-overrides.less"
                }
            }
        },
        // Project settings
        yeoman: {
            // configurable paths
            app: require('./bower.json').appPath || 'app',
            name: require('./bower.json').name || 'name',
            version: require('./bower.json').version || 'version',
            versionWithBuildNumberAndGitCommitId: '<%= yeoman.version %>.' + now.getFullYear() +
                ((now.getMonth() + 1) <= 9 ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1)) +
                (now.getDate() <= 9 ? '0' + now.getDate() : now.getDate()) +
                '.' +
                (now.getHours() <= 9 ? '0' + now.getHours() : now.getHours()) +
                (now.getMinutes() <= 9 ? '0' + now.getMinutes() : now.getMinutes()) +
                (now.getSeconds() <= 9 ? '0' + now.getSeconds() : now.getSeconds()) +
                ".<%= grunt.config.get('git-commit-id') %>",
            dist: 'dist',
            war: 'war'
        },
        // Watches files for changes and runs tasks based on the changed files
        watch: {
            js: {
                files: ['{.tmp,<%= yeoman.app %>}/{scripts,modules}/{,*/}*.*'],
                tasks: ['newer:jshint:all']
            },
            jsTest: {
                files: ['test/spec/{,*/}*.js'],
                tasks: ['newer:jshint:test', 'karma']
            },
            styles: {
                files: ['<%= yeoman.app %>/styles/less/{,*/}*.less', '<%= yeoman.app %>/styles/{,*/}*.css'], // which files to watch
                tasks: ['less', 'newer:copy:styles'],
                options: {
                    nospawn: true
                }
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= yeoman.app %>/{,*/}*.html',
                    '.tmp/styles/{,*/}*.css',
                    '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },
        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35729
            },
            // Proxy any calls to /api/* to our stubby mock api server
            proxies: [
                {
                    // Proxy for DEV1 wealth channel services
                    context: '/wealth/channel',
                    host: 'bfssyddev55-vip1',
                    port: 8447,
                    protocol: 'https',
                    https: true,
                    rejectUnauthorized: false,
                    changeOrigin: false,
                    xforward: false
                },
                {
                    // Proxy for DEV1 wealth Z1 services (interim until channel services are available)
                    context: '/dev1/wealth/services',
                    host: 'bfssyddev55-vip1',
                    port: 8445,
                    protocol: 'https',
                    https: true,
                    rejectUnauthorized: false,
                    changeOrigin: false,
                    xforward: false
                },
                {
                    // Proxy for DEV1 wealth Z1 services (interim until channel services are available)
                    context: '/wealth/services/reporting',
                    host: 'bfssyddev55-vip1',
                    port: 8450,
                    protocol: 'https',
                    https: true,
                    rejectUnauthorized: false,
                    changeOrigin: false,
                    xforward: false
                },
                {
                    context: '/api',
                    host: 'localhost',
                    port: 8882,
                    https: false,
                    changeOrigin: false,
                    xforward: false
                }
            ],
            rules: [
                // Internal rewrite rules
            ],
            livereload: {
                options: {
                    open: true,
                    base: [
                        '.tmp',
                        '<%= yeoman.app %>'
                    ],
                    middleware: function(connect, options) {
                        var middlewares = [];

                        var rewriteRulesSnippet = require('grunt-connect-rewrite/lib/utils').rewriteRequest;
                        middlewares.push(rewriteRulesSnippet);
                        var directory = options.directory || options.base[options.base.length - 1];
                        if (!Array.isArray(options.base)) {
                            options.base = [options.base];
                        }
                        options.base.forEach(function(base) {
                            // Serve static files.
                            middlewares.push(connect.static(base));
                        });

                        // Setup the proxy
                        middlewares.push(require('grunt-connect-proxy/lib/utils').proxyRequest);

                        // Make directory browse-able.
                        middlewares.push(connect.directory(directory));

                        return middlewares;
                    }
                }
            },
            test: {
                options: {
                    port: 9001,
                    base: [
                        '.tmp',
                        'test',
                        '<%= yeoman.app %>'
                    ]
                }
            },
            dist: {
                options: {
                    base: '<%= yeoman.dist %>'
                }
            }
        },
        configureRewriteRules: {
            options: {
                rulesProvider: 'connect.rules'
            }
        },
        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish'),
                force: true
            },
            all: [
                '<%= yeoman.app %>/modules/**/*.js'
            ],
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                src: ['test/spec/{,*/}*.js']
            }
        },
        // Empties folders to start fresh
        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: [
                            '.tmp',
                            '<%= yeoman.dist %>/*',
                            '!<%= yeoman.dist %>/.git*'
                        ]
                    }
                ]
            },
            server: '.tmp'
        },
        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/styles/',
                        src: '{,*/}*.css',
                        dest: '.tmp/styles/'
                    }
                ]
            }
        },
        // Renames files for browser caching purposes
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/scripts/{,*/}*.js'
                    ]
                }
            }
        },
        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: '<%= yeoman.app %>/index.html',
            options: {
                dest: '<%= yeoman.dist %>'
            }
        },
/*        uglify: {
          generated: {
            options: {
              sourceMap: function (script) {
                return script + '.map';
              },
              sourceMappingURL: function (script) {
                return script.replace('dist/scripts/', '') + '.map';
              },
              sourceMapPrefix: 3,
              sourceMapRoot: 'unmin'
            }
          }
        },*/
        // Performs rewrites based on rev and the useminPrepare configuration
        usemin: {
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
            options: {
                assetsDirs: ['<%= yeoman.dist %>']
            }
        },
        // The following *-min tasks produce minified files in the dist folder
        imagemin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/images',
                        src: '{,*/}*.{png,jpg,jpeg,gif}',
                        dest: '<%= yeoman.dist %>/images'
                    }
                ]
            }
        },
        svgmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/images',
                        src: '{,*/}*.svg',
                        dest: '<%= yeoman.dist %>/images'
                    }
                ]
            }
        },
        htmlmin: {
            dist: {
                options: {
                    // Optional configurations that you can uncomment to use
                    // removeCommentsFromCDATA: true,
                    // collapseBooleanAttributes: true,
                    // removeAttributeQuotes: true,
                    // removeRedundantAttributes: true,
                    // useShortDoctype: true,
                    // removeEmptyAttributes: true,
                    // removeOptionalTags: true*/
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>',
                        src: ['*.html', 'views/*.html'],
                        dest: '<%= yeoman.dist %>'
                    }
                ]
            }
        },
        // Allow the use of non-minsafe AngularJS files. Automatically makes it
        // minsafe compatible so Uglify does not destroy the ng references
        ngmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/concat/scripts',
                        src: '*.js',
                        dest: '.tmp/concat/scripts'
                    }
                ]
            }
        },
        // Replace Google CDN references
        cdnify: {
            dist: {
                html: ['<%= yeoman.dist %>/*.html']
            }
        },
        // Copies remaining files to places other tasks can use
        copy: {
            // This copy operation for building the WAR.
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>',
                        dest: '<%= yeoman.dist %>',
                        src: [
                            '*.{ico,png,txt}',
                            '.htaccess',
                            'images/**/*',
                            'modules/**/*',
                            'styles/**/*',
                            'bower_components/**/*.html',
                            'resources/app/**/*',
                            'resources/wem/**/*',
                            'resourcebundles/**/*'
                        ]
                    },
                    {
                        expand: true,
                        cwd: '.tmp/images',
                        dest: '<%= yeoman.dist %>/images',
                        src: [
                            'generated/*'
                        ]
                    }
                ]
            },
            styles: {
                expand: true,
                cwd: '<%= yeoman.app %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            },
            flattenCoverageResults: {
                expand: true,
                flatten: true,
                src: ['qualitymetrics/coverage/*/lcov.info'],
                dest: 'qualitymetrics/coverage/',
                filter: 'isFile'
            },
            webinf: {
                expand: true,
                src: ['WEB-INF/**'],
                dest: '<%= yeoman.dist %>/'
            },
            // TODO: Remove service stubs once Wealth scenarios are in Perceptor.
            svc: {
                src: ['svc/**'],
                dest: '<%= yeoman.dist %>/'
            }
        },
        // Run some tasks in parallel to speed up the build process
        concurrent: {
            server: [
                'copy:styles'
            ],
            test: [
                'copy:styles'
            ],
            dist: [
                'copy:styles',
                'svgmin',
                'htmlmin'
            ]
        },

        // Test settings
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
            }
        },
        // Stubby is a mock JSON response server for mocking REST calls
        stubby: {
            stubsServer: {
                options: {
                    callback: function(server, options) {
                        server.get(1, function(err, endpoint) {
                            if (!err)
                                console.log(endpoint);
                        });
                    },
                    relativeFilesPath: true, // when resolving files used in response, path will be relative to definition file
                    admin: 8010
                },
                // note the array collection instead of an object
                files: [
                    {
                        src: [
                            'app/modules/**/mockedendpoints/*.yaml',
                            'app/bower_components/**/mockedendpoints/*.yaml'
                        ]
                    }
                ]
            }
        },
        sonarRunner: {
            analysis: {
                options: {
                    debug: true,
                    separator: '\n',
                    sonar: {
                        host: {
                            url: 'http://bfssydtst175:9000'
                        },
                        jdbc: {
                            url: 'jdbc:h2:tcp://bfssydtst175:9092/sonar',
                            username: 'sonar',
                            password: 'sonar'
                        },
                        projectKey: '<%= yeoman.name %>:<%= yeoman.version %>',
                        projectName: '<%= yeoman.name %>',
                        projectVersion: '<%= yeoman.version %>',
                        sources: ['app/modules/noncommon'].join(','),
                        language: 'js',
                        sourceEncoding: 'UTF-8',
                        javascript: {
                            lcov: {
                                reportPath: 'qualitymetrics/coverage/lcov.info'
                            }
                        }
                    }
                }
            }
        },
        war: {
            target: {
                options: {
                    war_dist_folder: '<%= yeoman.dist %>',
                    war_verbose: true,
                    war_name: '<%= yeoman.name %>',
                    jbosswebxmlcontextpath : '/wealth/ui/client',
                    webxml_webapp_extras : '<filter></filter>'
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>',
                        src: ['**'],
                        dest: ''
                    }
                ]
            },
            tmpSit: {
                options: {
                    war_dist_folder: '<%= yeoman.dist %>',
                    war_verbose: true,
                    war_name: 'ebankingsdssit',
                    jbosswebxmlcontextpath : '/sit2/lab/alpha',
                    webxml_webapp_extras : '<filter></filter>'
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>',
                        src: ['**'],
                        dest: ''
                    }
                ]
            }
        },
        nexusDeployer: {
            release: {
                options: {
                    groupId: "com.mgl.wealth.platforms",
                    artifactId: '<%= yeoman.name %>',
                    version: '<%= yeoman.versionWithBuildNumberAndGitCommitId %>',
                    // version: '<%= yeoman.version %>',
                    packaging: 'war',
                    auth: {
                        username: grunt.option('nexus-user'),
                        password: grunt.option('nexus-password')
                    },
                    pomDir: 'dist/pom',
                    url: 'http://sdlc/nexus/content/repositories/bfs-releases',
                    artifact: 'dist/' + '<%= yeoman.name %>' + '.war',
                    noproxy: 'sdlc,localhost',
                    cwd: ''
                }
            },
            tmpSit: {
                options: {
                    groupId: "com.mgl.personalbanking.direct",
                    artifactId: '<%= yeoman.name %>',
                    version: '<%= yeoman.versionWithBuildNumberAndGitCommitId %>'+'sit',
                    packaging: 'war',
                    auth: {
                        username: grunt.option('nexus-user') || 'mrt_ci_svn_nexus',
                        password: grunt.option('nexus-password') || 'rc4ut0'
                    },
                    pomDir: 'dist/pom',
                    url: 'http://sdlc/nexus/content/repositories/bfs-releases',
                    artifact: 'dist/ebankingsdssit.war',
                    noproxy: 'sdlc,localhost',
                    cwd: '',
                    debug: false
                }
            }
        },
        "git-rev-parse": {
            "build" : {
                "options": {
                    prop: 'git-commit-id',
                    number: 6
                }
            }
        }
    });


    grunt.registerTask('serve', function(target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'configureRewriteRules',
            'concurrent:server',
            'less',
            'autoprefixer',
            'configureProxies',
            'connect:livereload',
            'stubby',
            'watch'
        ]);
    });

    grunt.registerTask('server', function() {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');

        grunt.task.run(['serve']);
    });

    grunt.registerTask('test', [
        'clean:server',
        'concurrent:test',
        'autoprefixer',
        'connect:test',
        'karma'
    ]);

    grunt.registerTask('buildJboss', [
        'git-rev-parse',
        'jshint',
        'clean:dist',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'concat',
        'less',
        'replace:disableLoggingInProduction',
        'ngmin',
        'copy:dist',
        'copy:webinf',
        // TODO: Remove service stubs once Wealth scenarios are in Perceptor.
        'copy:svc',
        'cdnify',
        'cssmin',
        'uglify',
        'rev',
        'usemin',
        'replace:insertMultiVersionNumbers',
        'war:target' ,
        // 'nexusDeployer:release'

    ]);

    grunt.registerTask('upload', ['git-rev-parse', 'nexusDeployer:release']);
    grunt.registerTask('tmpBuildJbossSit', [
        'git-rev-parse',
        'jshint',
        'clean:dist',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'concat',
        'less',
        'replace:disableLoggingInProduction',
        'ngmin',
        'copy:dist',
        'copy:webinf',
        'cssmin',
        'uglify',
        'rev',
        'usemin',
        'replace:insertMultiVersionNumbers',
        'war:tmpSit',
        'nexusDeployer:tmpSit'
    ]);

    grunt.registerTask('default', [
        'newer:jshint',
        'test',
        'build'
    ]);

    grunt.registerTask('sonar', [
        'test',
        'copy:flattenCoverageResults',
        'sonarRunner:analysis'
    ]);
};
