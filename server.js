var express = require('express');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var validator = require('email-validator');
var dotenv = require('dotenv');
var app = express();

dotenv.load();

app.use(express.static('./'));

app.set('views', __dirname)
app.set('view engine', 'ejs')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var indexRouter = require('./server/index');

app.use('/', indexRouter);

app.listen(process.env.SERVER, function(){
  console.log("HERE I AM.");
});

app.post('/contact', function(req,res){
  if (req.body.company) {
    res.render('index', {
      title: 'Contact',
      err: true,
      page: 'index',
      type: 'empty',
      body: req.body.message,
      name: req.body.name,
      email: req.body.email,
      msg: 'Bye, spam.',
      description: 'spam'});
    return;
  }

  if (! req.body.name || ! req.body.email) {
    res.render('index', {
      title: 'Contact',
      err: true,
      page: 'index',
      type: 'empty',
      body: req.body.message,
      name: req.body.name,
      email: req.body.email,
      msg: 'Fill out all the forms, please!',
      description: 'not successfully sent'});
    return;
  }

  var email_check = validator.validate(req.body.email);

  if (email_check == false) {
    res.render('index', {
      title: 'Contact',
      err: true,
      page: 'index',
      type: 'empty',
      body: req.body.message,
      name: req.body.name,
      email: req.body.email,
      msg: 'Put in a valid email, please!',
      description: 'not successfully sent'});
    return;
  }

  var mailOpts, smtpTrans;

  smtpTrans = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: "markandclintwed@gmail.com",
      pass: process.env.PASS
    }
  });

  mailOpts = {
    from: req.body.email,
    to: "markandclintwed@gmail.com",
    subject: 'An RSVP from ' + req.body.name,
    text: "Hey guys! " + req.body.name + " at " +req.body.email + " is coming to your wedding, and they're bringing " + req.body.adults + " adult(s) and " + req.body.children + " children. They may also want you to know this: " + req.body.message
  };

  smtpTrans.sendMail(mailOpts, function (error,info){
    if (error) {
      res.render('index', {
        title: 'Contact',
        page: 'index',
        type: 'error',
        msg: 'Put in a valid email, please!',
        description: 'not successfully sent'});
    }
    else {
      res.render('index', {
        title: 'Contact',
        page: 'index',
        type: 'success',
        description: 'successfully sent'});
    }
  });

});
