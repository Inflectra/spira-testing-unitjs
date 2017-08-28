const http = require('http');
const https = require('https');

module.exports = SpiraClient;

function SpiraClient(protocol, host, port, vdir, login, apiKey) {
    var self = this;
    this._protocol = protocol;
    this._host = host;
    this._port = port;
    this._vdir = vdir;
    this._login = login;
    this._apiKey = apiKey;

    //Set the default ports if none specified
    if (!this._port) {
        if (this._protocol == 'http') {
            this._port = 80;
        }
        if (this._protocol == 'https') {
            this._port = 443;
        }
    }

    this._SPIRA_PLUG_IN_NAME = 'MochaJS Reporter';
    this._SPIRA_URL_SUFFIX = '/Services/v5_0/RestService.svc/';
    console.log('Created SpiraTest API Client.');
}

SpiraClient.prototype.recordTestRun = function(projectId, testCaseId, releaseId, testSetId, startDate, endDate, executionStatusId, testName, assertCount, message, stackTrace) {
    var path;
    if (this._vdir && this._vdir != '') {
        path = '/' + this._vdir + this._SPIRA_URL_SUFFIX + 'projects/{project_id}/test-runs/record';
    }
    else {
        path = this._SPIRA_URL_SUFFIX + 'projects/{project_id}/test-runs/record';        
    }
    path = path.replace('{project_id}', projectId);

    //Convert the dates to WCF format
    const startDateWcf = this._createWcfDate(startDate);
    const endDateWcf = this._createWcfDate(endDate);
    
    //Construct the data object
    var remoteTestRun = {
        TestCaseId: testCaseId,
        ReleaseId: releaseId,
        TestSetId: testSetId,
        StartDate: startDateWcf,
        EndDate: endDateWcf,
        ExecutionStatusId: executionStatusId,
        RunnerName: this._SPIRA_PLUG_IN_NAME,
        RunnerTestName: testName,
        RunnerAssertCount: assertCount,
        RunnerMessage: message,
        RunnerStackTrace: stackTrace,
        TestRunFormatId: 1 /* Plain Text */
    };

    //Make the REST Call to send the data to Spira
    const postData = JSON.stringify(remoteTestRun);
    console.log('POST DATA: ' + postData);  

    const options = {
        hostname: this._host,
        port: this._port,
        path: path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
            'username': this._login,
            'api-key': this._apiKey
        }
    };

    console.log('Sending test results to SpiraTest: ' + this._protocol + '://' + options.hostname + ':' + options.port + options.path);
    
    //Handle HTTP or HTTPS
    var protocolRequest = http.request;
    if (this._protocol == 'https') {
        protocolRequest = https.request;
    }

    const req = protocolRequest(options, (res) => {
        //console.log(`STATUS: ${res.statusCode}`);
        //console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            if (res.statusCode != 200) {
                console.log(`BODY: ${chunk}`);
            }
        });
        res.on('end', () => {
            if (res.statusCode == 200) {
                console.log('Successfully sent test results to SpiraTest.');    
            }
            else {
                console.log('There was an error sending the test results to SpiraTest - ' + res.statusMessage + ' (' + res.statusCode + ')');                    
            }
        });
    });
    
    req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });
    
    // write data to request body
    req.write(postData);
    req.end();      
};

//Creates a WCF JSON date in format /Date(1245398693390)/ from a JS date object - no time zone required
SpiraClient.prototype._createWcfDate = function (/**Date*/dateObj)
{
    if (dateObj) {
        var dateInMsSince1970 = dateObj.getTime();
        return "/Date(" + dateInMsSince1970 + ")/";
    }
    return null;
};
