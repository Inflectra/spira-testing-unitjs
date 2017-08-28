var mocha = require('mocha');
var SpiraClient = require('./SpiraClient.js');

module.exports = SpiraReporter;

function SpiraReporter(runner) {
  mocha.reporters.Base.call(this, runner);

  var self = this;
  var color = mocha.reporters.Base.color;

  var passes = 0;
  var failures = 0;
  var startDate = new Date();

  runner.on('start', function () {
    console.log(color('suite', 'Starting Test Run'));
  });

  runner.on('pass', function(test){
    passes++;

    //Log to the console
    console.log(color('checkmark', mocha.reporters.Base.symbols.ok) + ' ' + color('pass', 'pass: %s'), test.fullTitle());
  });

  runner.on('fail', function(test, err){
    failures++;
    //Output to the console - Spec format
    console.log(color('fail', mocha.reporters.Base.symbols.err + ' fail: %s -- error: %s'), test.fullTitle(), err.message);
  });

  runner.on('end', function(){
    console.log(color('suite', 'Test Run ended with: %d passed, %d failed out of %d test(s).'), passes, failures, passes + failures);

    //Send to SpiraTest
    var spiraClient = new SpiraClient('http', '127.0.0.1', 80, 'spira', 'fredbloggs', '{7A05FD06-83C3-4436-B37F-51BCF0060483}');
    var projectId = 1;
    var testCaseId = 4;
    var releaseId = 1;
    var testSetId = null;
    var endDate = new Date();
    var executionStatusId = 1;
    var testName = 'Test Test';
    var assertCount = failures;
    var totalCount = passes + failures;
    var message = passes + ' passed, ' + failures + ' failed out of ' + totalCount + ' test(s).';
    var stackTrace = "TBD";
    spiraClient.recordTestRun(projectId, testCaseId, releaseId, testSetId, startDate, endDate, executionStatusId, testName, assertCount, message, stackTrace);

    //Return exit code
    process.exit(failures);
  });
}
