/**
 * @ngdoc function
 * @name connectToServer
 * @description Open connections to server
 * @since 0.0.1
 */

function connectToServer(url, method, dataType, successFunction, completeFunction, beforeSendFunction, errorFunction, postData) {
    jQuery.support.cors = true;

    $.ajax({
        url: url,
        type: method,
        crossDomain: true,
        cache: false,
        dataType: dataType,
        contentType: "application/json",
        success: successFunction,
        complete: completeFunction,
        beforeSend: beforeSendFunction,
        error: errorFunction,
        data: JSON.stringify(postData)
    });
}

//auth is the authentication object, (should consist username, password)
function ionicGET($http, url, successFn, errorFn, auth) {
  
    var url = url;
    //console.log("URL " + url);

    var basicToken = encodeHeader(auth.username, auth.password);

    //var basicToken = encodeHeaderJQueryWay(auth.username, auth.password);

    /*
    return $http.get(url, {
        headers: {
            'Authorization': basicToken,
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        }
    }).then(successFn, errorFn);
    */

    var getReq = {
        method: 'GET',
        url: url,
        headers: {
            'Authorization': basicToken,
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        }
    }

    return $http(getReq).then(successFn, errorFn);

}




function ionicPost($http, url, method, dataType, successFunction, completeFunction, beforeSendFunction, errorFunction, postData) {


    var req = {
        method: method,
        url: url,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        data: postData,
    }

    return $http(req).then(successFunction, errorFunction);
}



// Create Base64 Object
var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

/**
 * JavaScript function to encode the HTTP Request Header
 */
function encodeHeader(username, password, eid) {

    var separator = ':';//String.fromCharCode(0x1F);

    var authentication = username + separator + password;
    
    if(eid) {
        authentication += ":" + eid;
    }

    var b64 = Base64.encode(authentication);
    
    return 'Basic ' + b64;
}


/*
/**
 * JavaScript function to encode the HTTP Request Header
 */
 /*
function encodeHeaderJQueryWay(username, password) {
    
    var separator = String.fromCharCode(0x1F);
    
    var authentication = username + separator + password;
    
    var b64 = $().crypt({method: "b64enc",source: authentication});
    
    return 'Basic ' + b64;
}

*/


/**
 * Return a timestamp with the format "m/d/yy h:MM:ss TT"
 * @type {Date}
 */
 
function timeStamp() {
// Create a date object with the current time
  var now = new Date();
 
// Create an array with the current month, day and time
  var date = [ now.getMonth() + 1, now.getDate(), now.getFullYear() ];
 
// Create an array with the current hour, minute and second
  var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];
 
// Determine AM or PM suffix based on the hour
  var suffix = ( time[0] < 12 ) ? "AM" : "PM";
 
// Convert hour from military time
  time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;
 
// If hour is 0, set it to 12
  time[0] = time[0] || 12;
 
// If seconds and minutes are less than 10, add a zero
  for ( var i = 1; i < 3; i++ ) {
    if ( time[i] < 10 ) {
      time[i] = "0" + time[i];
    }
  }
 
// Return the formatted string
  return date.join("/") + " " + time.join(":") + " " + suffix;
}
