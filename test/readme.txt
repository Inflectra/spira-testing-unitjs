cd "C:\Subversion\Projects\SpiraTeam Add Ons\Trunk\Test Automation\UnitJS Integration"
node ./node_modules/mocha/bin/mocha .\test\example.js  --reporter .\reporter\SpiraReporter
node ./node_modules/mocha/bin/mocha .\test\example2.js  --reporter .\reporter\SpiraReporter