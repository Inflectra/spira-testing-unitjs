var mocha = require('mocha');

module.exports = SpiraReporter;

function SpiraReporter(runner) {
  mocha.reporters.Base.call(this, runner);

  var self = this;
  var color = mocha.reporters.Base.color;

  var passes = 0;
  var failures = 0;

  runner.on('start', function () {
    console.log(color('suite', 'Starting Test Run'));
  });

  runner.on('pass', function(test){
    passes++;

    //Log to the console
    console.log(color('checkmark', mocha.reporters.Base.symbols.ok) + ' ' + color('pass', 'pass: %s'), test.fullTitle());
    
    //Send to SpiraTest
  });

  runner.on('fail', function(test, err){
    failures++;
    //Output to the console - Spec format
    console.log(color('fail', mocha.reporters.Base.symbols.err + ' fail: %s -- error: %s'), test.fullTitle(), err.message);
    
    //Send to SpiraTest
  });

  runner.on('end', function(){
    console.log(color('suite', 'Test Run ended with: %d passe(s), %d failure(s) out of %d test(s).'), passes, failures, passes + failures);

    //Sent to SpiraTest
    process.exit(failures);
  });
}
