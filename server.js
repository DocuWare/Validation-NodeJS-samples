// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var validations = require('./validationsBeforeStoring');	//actual validation logic


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (http://127.0.0.1:4444/api)
router.get('/', function(req, res) {
	res.json({Status: 'OK', Reason: 'Validation web service is up and running' });
});


// register route for DocuWare calls (also accessible at http://127.0.0.1:4444/api)
router.post('/', function(req, res) {
	var DWInputValues = req.body;
	
	if (DWInputValues.Values.length > 0) {
		//call our validations
		console.log(DWInputValues)
		validations.checkValues(DWInputValues)
		.then(success => {
			res.json({Status: 'OK', Reason: '' });
		})
		.catch(function (error) {
			res.json({Status: 'Fail', Reason: error.message });
		});		
	}
	else{
		//handle test call from webclient settings	
		res.json({Status: 'OK', Reason: '' });
	}
});


// more routes for our API will happen here
// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);


// START THE SERVER
// =============================================================================
var port = process.env.PORT || 4444;        // set our port
app.listen(port);


console.log("Validation REST service is up and running");