/*
  load_env_heroku.js

  a simple script that loads your foreman .env file
  and sets all of the environment values on heroku

  usage:
  - place this script in the root of your project
  - run: node load_env_heroku.js
*/

var fs = require('fs');
var child_process = require('child_process');

fs.readFile('./.env',function(err,data){
  data.toString().split('\n').forEach(function(line){
    console.log('Setting ' + line + ' on heroku...');
    var result = child_process.execSync('heroku config:set '+line);
    console.log('result: ',result.toString());
  });
  console.log('');
  console.log('Config values set run "heroku config" to check values.');
});