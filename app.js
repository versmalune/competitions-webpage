var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');
var session = require('express-session');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var mongoose = require('mongoose');
var passport = require('passport');

var index = require('./routes/index');
var users = require('./routes/users');
var questions = require('./routes/questions');

var passportConfig = require('./lib/passport-config');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
if (app.get('env') === 'development') {
  app.locals.pretty = true;
}


// Pug의 local에 moment라이브러리와 querystring 라이브러리를 사용할 수 있도록.
app.locals.moment = require('moment');
app.locals.querystring = require('querystring');

//=======================================================
// mongodb connect
//=======================================================
mongoose.Promise = global.Promise; // ES6 Native Promise를 mongoose에서 사용한다.
const connStr = (process.env.NODE_ENV == 'production')?
  'mongodb://eugene:withyou1004@ds023438.mlab.com:23438/webpj' :
  'mongodb://localhost/mjdb1';
// 아래는 mLab을 사용하는 경우의 예: 본인의 접속 String으로 바꾸세요.
// const connStr = 'mongodb://dbuser1:mju12345@ds113825.mlab.com:13825/sampledb1';
mongoose.connect(connStr, {useMongoClient: true });
mongoose.connection.on('error', console.error);

// Favicon은 웹사이트의 대표 아이콘입니다. Favicon을 만들어서 /public에 둡시다.
// https://www.favicon-generator.org/ 여기서 만들어볼 수 있어요.
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// _method를 통해서 method를 변경할 수 있도록 함. PUT이나 DELETE를 사용할 수 있도록.
app.use(methodOverride('_method', {methods: ['POST', 'GET']}));

// sass, scss를 사용할 수 있도록
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  debug: true,
  sourceMap: true
}));

// session을 사용할 수 있도록.
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'long-long-long-secret-string-1313513tefgwdsvbjkvasd'
}));

app.use(flash()); // flash message를 사용할 수 있도록

// public 디렉토리에 있는 내용은 static하게 service하도록.
app.use(express.static(path.join(__dirname, 'public')));

//=======================================================
// Passport 초기화
//=======================================================
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);

// pug의 local에 현재 사용자 정보와 flash 메시지를 전달하자.
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;  // passport는 req.user로 user정보 전달
  res.locals.flashMessages = req.flash();
  next();
});

// Route
app.use('/', index);
app.use('/users', users);
app.use('/questions', questions);
require('./routes/auth')(app, passport);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


app.use(express.static(path.join(__dirname, 'public'))); //static한 access들 처리하는 것 -> 읽어 주고 public 디렉토리에 있으면 넘김

app.use('/', indexRouter); // '/'이 패턴이면 indexRouter 사용
app.use('/users', usersRouter);



// error handler
app.use(function(err, req, res, next) { //에러 핸들러
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};  //개발환경일 때만 error 메시지 띄움, production 환경일 떄는 안 보여 줌 -> 해킹됨

  // render the error page
  res.status(err.status || 500); //err.status 넘어왔으면 그것 쓰고 아니면 500 씀 (500번대 error는 internal error)
  res.render('error'); //렌더 - error라는 템플릿 가지고 찍음
});

module.exports = app;
