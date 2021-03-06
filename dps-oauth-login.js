'use strict';

/**
{
  redirectURI : "APPURL://oauth", // replace APPURL with the custom url handler prefix for your app
  clientId    : "com.sixd.oauthtest", // the adobe app id for the dps app
  selector    : "#twitter", // which button you want to trigger on click
  service     : "twitter" // the oauth authenticator to use
}
*/
function OAuthLogin(options) {
  this.options = options;
  if (typeof options.authUrl === 'undefined') {
    options.authUrl = 'https://entitlement-server.6dglobalcloud.com';
  }
  function errorCallback(error) {
    console.log(error);
  }
  function OAuthReset(callback) {
    function cb() {
      adobeDPS.oauthRedirectService.resetAuthData(callback, callback);
    }
    adobeDPS.oauthRedirectService.stopListening(cb, cb);
  }
  this.OAuthClick = function OAuthClick(event) {
    OAuthReset(function() {
      try {
        adobeDPS.oauthRedirectService.initAuthData(
          {
            authURL: options.authURL,
            redirectURI: options.redirectURI,
            clientId: options.clientId
          }, 
          function success() { 
            try {
              adobeDPS.oauthRedirectService.startListening(OAuthResponse, OAuthStart, errorCallback);
            }
            catch (error) { errorCallback(error); }
          }, 
          function error(e) { 
            errorCallback(e);
            adobeDPS.oauthRedirectService.stopListening(function() {}, function() {});
          }
        );
      } 
      catch (error) { errorCallback(error); }
    });
  }
  function OAuthStart() {
    var loginUrl= options.authURL + '/login/with/' + options.service;
    loginUrl += '?appId=' + encodeURIComponent(options.clientId);
    loginUrl += '&redirect_uri=' + options.redirectURI;
    adobeDPS.dialogService.open(loginUrl);
  }
  function OAuthResponse(response) {
    adobeDPS.dialogService.close();
    if (response.hasOwnProperty('timeout')) {
      adobeDPS.oauthRedirectService.stopListening(function() {}, function() {});
      console.log('The request timed out');
    }
    else if (response.hasOwnProperty('error')) {
      adobeDPS.oauthRedirectService.stopListening(function() {}, function() {});
      console.log('The server returned an error');
    } else {
      // success
      adobeDPS.authenticationService.login(null, null, response.auth_token);
    }
  }

  var nodes = document.querySelectorAll(options.selector);
  var self = this;
  for(var i = 0; i < nodes.length; i++) {
    nodes[i].addEventListener('click', function(e) {
      self.OAuthClick(e);
    });
  }
}