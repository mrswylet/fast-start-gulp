//npm i gulp gulp-sass gulp-concat gulp-uglifyjs gulp-cssnano gulp-rename gulp-autoprefixer --save-dev
var gulp = require('gulp'), //Подключаем Gulp
	sass = require('gulp-sass'), //Подключаем Sass пакет
	concat = require('gulp-concat'), //Подключаем gulp-concat (для конкатенации/склейки файлов)
	uglify = require('gulp-uglifyjs'), //Подключаем gulp-uglifyjs (для сжатия JS)
	cssnano = require('gulp-cssnano'), //Подключаем пакет для минификации CSS
	rename = require('gulp-rename'), //Подключаем библиотеку для переименования файлов
	autoprefixer = require('gulp-autoprefixer'); //Подключаем библиотеку для автоматического добавления префиксов

gulp.task('sass', function () { //Создаем таск Sass
	return gulp.src([
		'src/scss/style.scss'
	]) //Указываем откуда брать файлы
		.pipe(sass({uotputStyle: 'expanded'}).on('error', sass.logError))
		.pipe(autoprefixer([ // Создаем префиксы и делаем их настройку
				'last 15 version',
				'ie 10',
				'ie 9'],
			{cascade: true}))
		// .pipe(cssnano())
		.pipe(gulp.dest('dist/css')) //Выгружаем результата
});

gulp.task('css', ['sass'], function () { //Выбираем файл для минификации
	return gulp.src('dist/css/style.css')
		.pipe(cssnano()) //Сжимаем
		.pipe(rename({suffix: '.min'})) //Добавляем суффикс .min
		.pipe(gulp.dest('dist/css')); //Выгружаем в папку
});

gulp.task('libsjs', function () {
	return gulp.src([ //Берем все необходимые библиотеки
		'src/js/*.js',
	])
		.pipe(concat('libs.min.js')) //Собираем их в кучу в новом файле libs.min.js
		.pipe(uglify()) //Сжимаем JS файл
		.pipe(gulp.dest('dist/js')); //Выгружаем в папку public_html/js
});

gulp.task('buildjs', function () {
	return gulp.src([ //Берем все необходимые библиотеки
		//'dist/js/libs.min.js',
		//'www/js/core/config.js',
		'src/js/*.js',
	])
		.pipe(concat('style.min.js')) //Собираем их в кучу в новом файле libs.min.js
		.pipe(uglify()) //Сжимаем JS файл
		.pipe(gulp.dest('dist/js')); //Выгружаем в папку public_html/js
});