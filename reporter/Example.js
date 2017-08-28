// This file is an example of how to call the Spira Client API without using MochaJS
var SpiraClient = require('./SpiraClient.js');

var spiraClient = new SpiraClient('http', '127.0.0.1', 80, 'spira', 'fredbloggs', '{7A05FD06-83C3-4436-B37F-51BCF0060483}');
var projectId = 1;
var testCaseId = 4;
var releaseId = 1;
var testSetId = null;
var startDate = new Date();
var endDate = new Date();
var executionStatusId = 1;
var testName = 'Test Test';
var assertCount = 1;
var message = "Test";
var stackTrace = "TBD";
spiraClient.recordTestRun(projectId, testCaseId, releaseId, testSetId, startDate, endDate, executionStatusId, testName, assertCount, message, stackTrace);

