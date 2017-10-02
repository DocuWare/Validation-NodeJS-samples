# Sample REST sevice for new validation with DocuWare 6.12
> A sample REST validation engine provided as NodeJS for use with DocuWare Cloud and DocuWare 6.12 (and above)


With the release of DocuWare 6.12 you're now able to simply verify all index fields before the actual storage to the file cabinet. It's so comfortable to use and flexible for so many scenarios.

Things like dynamic mandatory fields or lookups for avoiding duplicates works like a charm!
The best? The user is being directly notified in the DocuWare webclient in case of wrong entries.

The validation inside DocuWare requires a REST service in order to send all index entries to this.
With this sample application we're going to show you how easily you can setup your own validation webservice.



## Installing validation REST service locally / Getting started with NodeJS
As the new validation only requires a REST service we've provided this sample app for NodeJS.
It's not required to run your validation service on the same DocuWare server.
**Only make sure that you've the latest version DocuWare 6.12 installed.**

1.	Install latest version of NodeJS https://nodejs.org/en/
	a. Install with all options activated
    b. Brief tutorial of installation: https://nodesource.com/blog/installing-nodejs-tutorial-windows/
2.	Unzip all files for validation into “C:\NewValidationService\” or any other location
3.	Open new windows command prompt and navigate to “C:\NewValidationService\” 
4.	Enter following command for installing all required modules for application: npm install



### Supported DocuWare versions
These sample validations requires a ***DocuWare 6.12*** system or higher.


## Contributing

If you'd like to contribute, please fork the repository and use a feature
branch. Pull requests are warmly welcome.

## Licensing

*DocuWare Platform .NET Client* proudly uses the [MIT License](LICENSE).

