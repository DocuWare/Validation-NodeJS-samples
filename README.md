# Sample REST service for new validation with DocuWare 6.12
> A sample REST validation engine provided as NodeJS for use with DocuWare Cloud and DocuWare 6.12 (and above)


With the release of DocuWare 6.12 you're now able to simply verify all index fields before the actual storage to the file cabinet. It's so comfortable to use and flexible for so many scenarios.

Creating dynamic mandatory fields or lookups to external data or to DocuWare before storing is so easy.
The best? The user is being directly notified in the DocuWare webclient in case of wrong entries.
[Get an overview on sample validations coming with this service](#features)

The new validation inside DocuWare requires a REST service in order to send all index entries to this.
With this sample application we're going to show you how easily you can setup your own validation webservice.



## Installing validation REST service locally / Getting started with NodeJS
As the new validation only requires a REST service we've provided this sample app for NodeJS.
It's not required to run your validation service on the same DocuWare server.
You can even host it on platforms like Mircosoft Azure, Cloud9 or Heroku.

**Make sure that you running the latest version of DocuWare 6.12 for the sample validatios.**

1.	Install latest version of NodeJS https://nodejs.org/en/
	a. Install with all options activated
    b. Brief tutorial of installation: https://nodesource.com/blog/installing-nodejs-tutorial-windows/
2.	Clone the sources: `git clone https://github.com/DocuWare/Validation-NodeJS-samples.git`
3.	In the command prompt navigate to the folder where the sample app was cloned.
4.	Enter following command for installing all required NodeJS modules: `npm install`
5.	Edit & check all settings from [DWValidatonSettings.js](../master/DWValidationSettings.js) that comes with the application.
6.	Go back command prompt and start application with this command: `node server.js`

Now you receive a message that the validation service was successfully started.


## Developing

Setting up your own validations is really easy with NodeJS:
1.	Install Visual Studio Code as editor for NodeJS.
Follow this tutorial: https://code.visualstudio.com/docs/nodejs/nodejs-tutorial
2.  Load the workspace folder of the sample application into Visual Studio Code.
3.  Modify or extend [validationsBeforeStoring.js](../master/validationsBeforeStoring.js) according to your needs.

**_ NOTE: Don’t touch the server.js otherwise your application may not work correctly. _**

### JSON send by DocuWare to validation service
Data which will be send to the validation service will look like this:
```json
{
	"TimeStamp": "2017-04-07T13:10:44.8888824Z",
	"UserName": "John Doe",
	"OrganizationName": "Peters Engineering",
	"FileCabinetGuid": "8d36692d-e694-4d8c-93db-e97c98897515",
	"DialogGuid": "ac07d242-0120-4575-8722-7c5ae7286026",
	"DialogType": "InfoDialog",
	"Values": [{
		"FieldName": "TEXTFIELD",
		"ItemElementName": "String",
		"Item": "some text"
	},
	{
		"FieldName": "INTFIELD",
		"ItemElementName": "Int",
		"Item": 1234
	},
	{
		"FieldName": "DECIMALFIELD",
		"ItemElementName": "Decimal",
		"Item": 123.45
	},
	{
		"FieldName": "MEMOFIELD",
		"ItemElementName": "Memo",
		"Item": "Long long long long long text"
	},
	{
		"FieldName": "DATEFIELD",
		"ItemElementName": "Date",
		"Item": "2017-04-01T00:00:00Z"
	},
	{
		"FieldName": "DATETIMEFIELD",
		"ItemElementName": "DateTime",
		"Item": "2017-04-02T12:30:00Z"
	},
	{
		"FieldName": "KEYWORDFIELD",
		"ItemElementName": "Keywords",
		"Item": {
			"Keyword": ["keyword1", "keyword2","keyword3"]
		}
	}]
}
```

###### TimeStamp
Time stamp of the request. Datetime in UTC formatted in the [Roundtrip format](https://docs.microsoft.com/en-us/dotnet/standard/base-types/standard-date-and-time-format-strings#Roundtrip)

###### UserName
The long name of the DocuWare user that requests the validation.

###### OrganizationName
The name of the organization containing the dialog.

###### FileCabinetGuid
Guid of the file cabinet containing the dialog.

###### DialogGuid
Guid of the dialog for which the validation is made.

###### DialogType
Type of the dialog. Available values are:
* `InfoDialog` - Info dialog for editing index values.
* `Store` - Store dialog for storing new documents in the file cabinet.

###### Values
A list of values to be validated. Each value contains the following elements:
* `FieldName` - the db name of the field.
* `ItemElementName` - string value representing the type of the field. Can be one of the following:
 * `String` - Value element is string in quotation marks. Example: "Some text"
 * `Int` - Value element is Int32 or Int64 formatted in Invariant culture. Example: 1243
 * `Decimal` - Value element is Decimal formatted in Invariant culture. Example: 123.45
 * `Memo` - Value element element is string in quotation marks. "Some long text"
 * `Date` - Date in UTC formatted in the [Roundtrip format](https://docs.microsoft.com/en-us/dotnet/standard/base-types/standard-date-and-time-format-strings#Roundtrip) always in midnight. Example: "2017-04-01T00:00:00Z"
 * `DateTime` - Datetime in UTC formatted in the [Roundtrip format](https://docs.microsoft.com/en-us/dotnet/standard/base-types/standard-date-and-time-format-strings#Roundtrip). Example: "2017-04-02T12:30:00Z"
 * `Keywords` - Element contains subelement "Keyword" with value array of strings. Example: 
	`{"Keyword": ["keyword1", "keyword2","keyword3"]}`
* `Item` - The value of the field formatted as described above.
<br />

### Expected JSON response format by DocuWare
**_ NOTE: Make sure you always return HTTP status code 200. Because this is used for testing the availability of the validation service! _**

The expected response is JSON with the following structure:
```javascript
// Successful validation
{
	"Status": "OK",
	"Reason": "Everything is fine"
}

// Failed validation
{
	"Status": "Failed",
	"Reason": "Your input is not OK! Check the values!"
}
```

###### Status
The status of the validation. For successful validation the expected value is "OK". Every other value indicates that the validation has failed.

###### Reason (Optional)
Reason for the failed validation. This is the message that is shown to the user.

## Register validation service in DocuWare
1. Open open DocuWare configuration and edit the details of the desired store dialog.
**_ NOTE: You can also configure validation in info dialogs. So it will be triggered on every updated document. _**
2. Register this URL as your validation web service URL: http://127.0.0.1:4444/api (applies to locally running validation service)
3. After testing the availability of the service you can store your changes.

Now you're ready to complete validations before storing. Any unhandled error message will be displayed in the command prompt. All handled validation errors will be directly displayed by the web client.




## Supported DocuWare versions
These sample validations requires an installation of ***DocuWare 6.12*** system or higher.



## <a name="features"></a>Features
##### 1. Check for amount on invoices
For every stored document by the doc. type “invoice” an amount must be provided.
You can setup your DBFields in the config file accordingly.
<br />


##### 2. Check for project on quotes
Just like above a similar check is being executed. Now this if the doc. type contains “quote” it will look for a proper project field.
<br />


##### 3. Check for already existing invoices before storing
This is a bit more complex check. Before storing any document of doc. type “invoice” it will check via a Platform REST API call if a similar document with the same **document number, document date and supplier** is already existing.
**_ NOTE: Configure DocuWare connection and search dialog GUID accordingly in the settings file. _**
<br />


##### 4. Check for correct due date
By this we make sure that the due date is in future.
<br />

##### 5. Lookup for supplier ID into external system
The demo application also holds a check for correct supplier IDs. However this one is only a sample check with no real database connection. 
**It will only check if the supplier ID is 4711. Otherwise the actual store will fail.**
<br />



## Contributing

If you'd like to contribute, please fork the repository and use a feature
branch. Pull requests are warmly welcome.

## Licensing

*DocuWare Validation NodeJS samples* proudly using the [MIT License](LICENSE).

