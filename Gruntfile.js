module.exports = function(grunt) {
    grunt.initConfig({
        /*
        postcss: {
            options: {
                processors: [
                    require('autoprefixer')({browsers: ['last 3 version']})
                ]
            },
            dist: {
                src: 'build/style.css'
            }
        },
        */
        sass: {
            files: ['src/style/style.scss', 'src/style/0-utility/*', 'src/style/1-base/*', 'src/style/2-blocks/*', 'src/style/3-layout/*', '!src/style/0-utility/bourbon', '!src/style/0-utility/neat'],
            dist: {
                options: {
                    style: 'compressed',
                    sourcemap: 'none',
                    noCache: true
                },
                files: {
                    'build/style.css':'src/style/style.scss'
                }
            }
        },
        concat: {
            files: ['src/scripts/app.js', 'src/scripts/services/*.js', 'src/scripts/controllers/*.js', 'src/scripts/directives/*.js'],
            options: {
                separator: '\n',
            },
            dist: {
                src: ['src/scripts/app.js', 'src/scripts/services/*.js', 'src/scripts/controllers/*.js', 'src/scripts/directives/*.js'],
                dest: 'build/code.js',
            },
        },
        uglify: {
            target: {
                files: {
                    'build/code.min.js': 'build/code.js'
                }
            }
        },
        watch: {
            options: {
                livereload: true
            },
            files: ['<%= sass.files %>', '<%= concat.files %>', '**/*.html'],
            tasks: ['sass', 'concat', 'uglify'],
        },
        connect: {
            server: {
                options: {
                    port: 4000,
                    hostname: 'localhost',
                    base: 'C:/Users/Jarmo/development/elearning', // Project folder root, put your own
                    livereload: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-sass');

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('server', "Serving the app", [
        'connect:server', 'watch' ]);

};
