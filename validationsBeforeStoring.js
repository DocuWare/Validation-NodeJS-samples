const DWparameters = require('./DWValidationSettings');
const validator = require('validator');	
const unirest = require('unirest');



exports.checkValues = function (DWInputValues) {
	var invoiceNo = this.getFieldValue(DWInputValues.Values, DWparameters.fieldNameDOCNUMBER);
	var invoiceDate = this.getFieldValue(DWInputValues.Values, DWparameters.fieldNameDOCDATE);
	var supplierID = this.getFieldValue(DWInputValues.Values, DWparameters.fieldNameSUPPLIER);	

	return new Promise((resolve, reject) => {
		this.hasAmountOnInvoices(DWInputValues.Values)
		.then(success => {
			if (!success) {
				throw new Error('Amount must be provided for an invoice');
			}

			return success;
		})
 		.then(success => this.isDuplicateInvoice(DWInputValues.FileCabinetGuid, invoiceNo, invoiceDate, supplierID))
 		.then(success => {
			if (!success) {
				throw new Error('There is already an invoice stored (#'+ invoiceNo +' from:'+ invoiceDate +' - SupplierID:' + supplierID + ')');
			}

			return success;
		})
		.then(success => this.hasProjectOnQuote(DWInputValues.Values))
		.then(success => {
			if (!success) {
				throw new Error('Please fill the project accordingly');
			}

			return success;
		})
		.then(success => this.isDueDateInFuture(DWInputValues.Values))
		.then(success => {
			if (!success) {
				throw new Error('Due date must be in future');
			}

			return success;
		})
		.then(success => this.isSupplierExisting(DWInputValues.Values))
		.then(success => {
			if (!success) {
				throw new Error('SupplierID could not be found CRM');
			}

			return success;
		})
		.then(success => resolve(true))
		.catch(function (error){
			reject(error);
		})
	});
}


exports.getFieldValue = function (DWIndexFieldCollection, fieldName) {
	var field = DWIndexFieldCollection.find(x => x.FieldName == fieldName);
	if (field === undefined) {
		return;
	}

	return field.Item;
}

exports.checkOnMandatoryFields = function (DWFields, triggerContains, mandatoryFieldName) {
	var docTypeField = this.getFieldValue(DWFields, DWparameters.fieldNameDOCTYPE);
	
	//there is no docTypeField return from here
	if (docTypeField === undefined) {
	 return true;
	}
	
	var isTriggeredField = validator.contains(docTypeField.toLowerCase(), triggerContains);
	
	if (!isTriggeredField) {
		return true;
	}
	
	var mandatoryField = this.getFieldValue(DWFields, mandatoryFieldName);
	return (mandatoryField != undefined);
	
}

exports.hasAmountOnInvoices = function (DWFields) {
	return Promise.resolve(this.checkOnMandatoryFields(DWFields, DWparameters.TRIGGER_STRING_DOCTYPE_INVOICE, DWparameters.fieldNameAMOUNT));
}

exports.hasProjectOnQuote = function (DWFields) {
	return Promise.resolve(this.checkOnMandatoryFields(DWFields, DWparameters.TRIGGER_STRING_DOCTYPE_QUOTE, DWparameters.fieldNamePROJECT));
}

exports.isDueDateInFuture = function (DWFields) {
	var dueToField = DWFields.find(x => (x.FieldName === DWparameters.fieldNameDATE));
 	if (dueToField === undefined) {
		return true;
	}
	   
	return Promise.resolve(validator.isAfter(dueToField.Item));
}

exports.isDuplicateInvoice = function (fileCabinetGUID, invoiceNo, invoiceDate, supplierID) {
	return new Promise((resolve, reject) => {	
		var CookieJar = unirest.jar(true);

		//logon to DW PLATFORM and retrieve cookie;
		unirest.post(DWparameters.DWPlatformUrl + '/Account/Logon')
		.headers({'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'})
		.jar(CookieJar)
		.send({ 'UserName': DWparameters.DWPlatformUser, 'Password': DWparameters.DWPlatfromPassword, 'Organization': DWparameters.DWPlatformOrganization, 'RememberMe': false, 'RedirectToMyselfInCaseOfError': true })
		.end(function (response) {
			unirest.post(DWparameters.DWPlatformUrl + '/FileCabinets/'+ fileCabinetGUID +'/Query/DialogExpression?dialogId='+ DWparameters.DWSearchDialogGUIDForInvoiceSearch +'&format=table')
			.headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
			.jar(CookieJar)
			.send({ 'Condition':[
				{ 'DBName':DWparameters.fieldNameDOCNUMBER, 'Value': [invoiceNo] },
				{ 'DBName':DWparameters.fieldNameDOCDATE, 'Value': [invoiceDate, null] },
				{ 'DBName':DWparameters.fieldNameSUPPLIER, 'Value': [supplierID, null] },  
			],
			'SortOrder':[],'ForceRefresh':true,'FlagConditions':{'IncludeCheckedOut':false},'Operation':'And','AdditionalResultFields':[],'Start':0,'Count':1})
			.end(function (response) {
				if (response.error) {
					return reject(new Error(response.error.message));
				}


				try {
					var resultCount = response.body.Count.Value;
					return resolve(resultCount == 0);				
				} catch (error) {
					return reject(new Error("Unable to retrieve similar invoices. Error:" + error));
				}
			});
		});
	})
}


exports.isSupplierExisting = function (DWFields) {
	var supplierID = this.getFieldValue(DWFields, DWparameters.fieldNameSUPPLIER);

	//setup connection to database
	//....

	//query for supplier in CRM
	//....
	var doesSupplierExistInCRM = (supplierID == 4711);
	
	return Promise.resolve(doesSupplierExistInCRM);
}