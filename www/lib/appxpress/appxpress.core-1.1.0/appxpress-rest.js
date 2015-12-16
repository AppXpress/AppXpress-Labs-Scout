//TODO: specify version here

var AppXpress = function() {
    
	//appxpress connection values should be set in the code on app initialization
	this.softwareProviderDataKey = "";
	this.applicationHostName = "";
    this.authToken = "";
	this.etag = null;
    
	//    this.softwareProviderDataKey = "d40249378b53097c2199f9a9eb635db64d73e617";
	//    this.applicationHostName = "QA";
	
	//    this.softwareProviderDataKey = "caf0126ce63b02c06e399165b561d6232948a9f3";
	//    this.applicationHostName = "QA2";
    
	//    this.softwareProviderDataKey = "01a0fa530cc7785dd0c91a91381a8f24c5a4d709";
	//    this.applicationHostName = "CQA";
    
	//returns authentication token
	this.getAuthentication = function(callback) {
		var url = "?dataKey=" + this.softwareProviderDataKey;
		ajaxConnect(this.applicationHostName, url, 'GET', true, 'json',
                    callback, this.completeCallback, this.setHeader,
                    this.connectionError);
        
	};
    
	//returns list of parties in the organization's community
	this.getCommunityPartyList = function(callback) {
		var url = "party/list?dataKey=" + this.softwareProviderDataKey;
		ajaxConnect(this.applicationHostName, url, 'GET', true, 'json',
                    callback, this.completeCallback, this.setHeader,
                    this.connectionError);
	};
    
	//returns list of parties of the specified document
	this.getDocumentPartyList = function(docType, docId, callback) {
		var url = docType + "/" + docId + "?dataKey="
        + this.softwareProviderDataKey;
		ajaxConnect(this.applicationHostName, url, 'GET', true, 'json',
                    callback, this.completeCallback, this.setHeader,
                    this.connectionError);
	};
    
	//creates the customobject
	this.createCustomObject = function(objDesignName, jsonString, callback) {
		var url = objDesignName + "?dataKey=" + this.softwareProviderDataKey;
		ajaxConnectPost(this.applicationHostName, url, jsonString, true,
                        'json', callback, this.completeCallback, this.setHeader,
                        this.connectionError);
	};
    
	//fetch custom object by id
	this.getCustomObjectById = function(objDesignName, uid, callback) {
		var url = objDesignName + "/" + uid + "/?dataKey="
        + this.softwareProviderDataKey;
		ajaxConnect(this.applicationHostName, url, 'GET', true, 'json',
                    callback, this.completeCallback, this.setHeader,
                    this.connectionError);
	};
    
	//fetch custom object by oql
	this.getCustomObjectByOql = function(objDesignName, oql, limit, offset, callback) {
		var url = objDesignName + "/?dataKey=" + this.softwareProviderDataKey;
		if(limit != null){
			url = url + "&limit="+ limit;
		}
		if(offset != null){
			url = url + "&offset="+ offset; 			
		}
		url = url+ "&oql=" + oql;
		ajaxConnect(this.applicationHostName, url, 'GET', true, 'json',
                    callback, this.completeCallback, this.setHeader,
                    this.connectionError);
	};
    
	//update custom object
	this.updateCustomObject = function(objDesignName, uid, jsonString, callback) {
		var url = objDesignName + "/" + uid + "?dataKey="
        + this.softwareProviderDataKey;
		ajaxConnectPost(this.applicationHostName, url, jsonString, true,
                        'json', callback, this.completeCallback, this.setHeader,
                        this.connectionError);
	};
    
	//search for pos by poNumber
	this.getPOListByPONumber = function(searchInput, callback) {
		var url = "orderDetail?dataKey=" + this.softwareProviderDataKey + "&oql= poNumber CONTAINS \"" + searchInput + "\"";
		ajaxConnect(this.applicationHostName, url, 'GET', true, 'json',
                    callback, this.completeCallback, this.setHeader,
                    this.connectionError);
	};
    
    
    //search for pos by poNumber or its Parent PO Number
    this.getPOListByParentOrPONumber = function (searchInput, callback){
    	// The contractNumber format is <season code>-<Parent PO  Number>
        var url = "orderDetail?dataKey=" + this.softwareProviderDataKey+"&oql= ((UCase(poNumber) STARTS WITH UCase(\""+searchInput+"\")) OR (UCase(contractNumber) CONTAINS UCase(\"" + searchInput + "\"))) AND __metadata.status = \"Active\"";
        
        ajaxConnect(this.applicationHostName, url, 'GET',true, 'json', callback, this.completeCallback, this.setHeader, this.connectionError);
    };
    
	//search for invoices by invoiceNumber
	this.getInvListByInvNumber = function(searchInput, callback) {
		var url = "invoiceDetail?dataKey=" + this.softwareProviderDataKey
        + "&oql= invoiceNumber CONTAINS \"" + searchInput + "\"";
		ajaxConnect(this.applicationHostName, url, 'GET', true, 'json',
                    callback, this.completeCallback, this.setHeader,
                    this.connectionError);
	};
	
	// change object workflow
	this.setObjectWorkflow = function(objDesignName, uid, action , jsonString, callback) {
		var url = objDesignName + "/" + uid + "/transition/wf_" + action + "?dataKey="
        + this.softwareProviderDataKey;
		ajaxConnectPost(this.applicationHostName, url, jsonString, true,
                        'json', callback, this.completeCallback, this.setHeader,
                        this.connectionError);
	};

	this.pollFutureID = function(objDesignName, uid, futureId, callback) {
		var url = objDesignName + "/" + uid + "/?futureId=" + futureId
				+ "&dataKey=" + this.softwareProviderDataKey;
		ajaxConnect(this.applicationHostName, url,'GET', true, 'json',function(response) {
					if (response.resolvedFuture) {
						appxDebugger.log("Resolved");
						callback(response);
					} else {
						setTimeout(function() {
							appxDebugger.log("POLL: " + objDesignName+"," + uid+","+futureId );
							appxpress.pollFutureID(objDesignName, uid, futureId, callback);
						}, 1000);
					}

				}, this.completeCallback, this.setHeader, this.connectionError);
	};
    
	this.connectionError = function(xhr, ajaxOptions, thrownError) {
		try{
			appxDebugger.log("HTTP status: " + xhr.status + " > " + thrownError);
			appxDebugger.log("Error Response: " + JSON.stringify(thrownError));
		}catch(e){
			
		}
		//showMessage("E", xhr.status + " > " + thrownError, 9000);
		showMessage("E", "Please check your internet connection.", 8000);
        
	};
    
	this.setHeader = function setHeader(xhr) {
		appxDebugger.log("HEADER AUTH LOCAL: " + appxpress.authToken);
		xhr.setRequestHeader('Authorization', appxpress.authToken);
//		appxDebugger.log("HEADER AUTH LOCAL: " + localStorage.getItem("authToken"));
//		xhr.setRequestHeader('Authorization', localStorage.getItem("authToken"));
		xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        
		if (appxpress.etag != null) {
			// alert("Etag : " + eTag);
			xhr.setRequestHeader('If-Match', '"'+ appxpress.etag + '"');
		}
        
	};
    
	this.completeCallback = function(response) {
		appxDebugger.log("Callback Response: " + response.status);
		if (response.status == 200 || response.status == 201
            || response.status == 202) {
			
			var authResponse = response.getResponseHeader('Authorization');
			if(authResponse != null) {
				appxDebugger.log("AuthToken (in Response): " + authResponse);
				// appxpress.authToken = authResponse;//overwrite existing token
				this.authToken = authResponse;
			}
			
			//remove etag for subsequent requests
			appxpress.etag = null;
			
		} else if (response.status == 304 ) {
			appxDebugger.log("304 returned");
			showMessage("E", "Unable to save. Someone else is also working on this document.", 8000);
			progressBar(false);
		}  else if (response.status == 401 || response.status == 403) {
			showMessage(
                        "E",
                        "Incorrect Username and/or Password or insufficent access rights",
                        4000);
			//exit("Incorrect Username and/or Password or insufficent access rights");
			progressBar(false);
		}else if (response.status == 400 ) {
			appxDebugger.log("JSON RESPONSE 400: " + JSON.stringify(response));
            //FIXME:
            // chcek whether error is session expire
            if(true) {
                showMessage("E", "Session expired OR you are logged-in from another device.", null);
            } else {
                // else show the actual error
                showMessage("E", response.status, 8000);
            }
            
            
			progressBar(false);
		}
		else if (response.status > 400
                && response.status < 500) {
			showMessage("E", "Data error. Please try again later.", 8000);
			progressBar(false);
		} 
		else if (response.status >= 500
                   && response.status < 600) {
			showMessage("E", "Server error. Please try again later.", 8000);
			progressBar(false);
		} else {
			//do nothing. probably connection error.
			showMessage("E", "Please check your internet connection.", 8000);
			progressBar(false);
		}
        
	};
    
};

var appxpress = new AppXpress();//use this object for method calls