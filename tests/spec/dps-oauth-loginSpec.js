var adobeDPS = {
  oauthRedirectService: {
    _initError: null,
    _initSuccess: null,
    _startSetup: null,
    _startSuccess: null,
    _startError: null,
    startListening: function(cb1,cb2,cb3) { this._startSetup = cb2; this._startSuccess = cb1; this._startError = cb3; },
    stopListening: function(cb1,cb2) { cb1(); },
    resetAuthData: function(cb1,cb2) { cb1(); },
    initAuthData: function(data, cb1, cb2) { this._initSuccess = cb1; this._initError = cb2; }
  },
  dialogService: {
    open: function(url) {},
    close: function() {}
  },
  authenticationService: {
    login: function(username, password, token) {}
  }
};

describe("OAuthLogin", function() {
  var oauthButton;

  var options = {
    selector: "#selector",
    redirectURI: "redirectURI",
    clientId: "clientId",
    service: "service"
  };
  beforeEach(function() {
    oauthButton = new OAuthLogin(options);
  });
  it('should add a click event on construction', function() {
    var button = document.createElement("button")
    document.body.appendChild(button);
    button.id = "selector";
    
    oauthButton = new OAuthLogin(options);

    spyOn(oauthButton, 'OAuthClick');

    button.click();
    expect(oauthButton.OAuthClick).toHaveBeenCalled();

  });
  it('should set the authUrl to production', function() {
    expect(oauthButton.options.authUrl).toEqual('https://entitlement-server.6dglobalcloud.com');
  });
  it("should stop listening and reset the existing authdata first", function() {
    spyOn(adobeDPS.oauthRedirectService,'stopListening').and.callThrough();
    spyOn(adobeDPS.oauthRedirectService,'resetAuthData');
    spyOn(adobeDPS.oauthRedirectService,'startListening');
    oauthButton.OAuthClick();
    expect(adobeDPS.oauthRedirectService.stopListening).toHaveBeenCalled();
    expect(adobeDPS.oauthRedirectService.resetAuthData).toHaveBeenCalled();
    expect(adobeDPS.oauthRedirectService.startListening).not.toHaveBeenCalled();
  });
  describe('', function() {
    beforeEach(function() {
      spyOn(adobeDPS.oauthRedirectService,'startListening').and.callThrough();
      spyOn(adobeDPS.oauthRedirectService,'stopListening').and.callThrough();
      spyOn(adobeDPS.oauthRedirectService,'resetAuthData').and.callThrough();
      spyOn(adobeDPS.oauthRedirectService,'initAuthData').and.callThrough();
      oauthButton.OAuthClick();
    });
    it('should call initAuthData with options', function() {
      expect(adobeDPS.oauthRedirectService.initAuthData).toHaveBeenCalledWith({
        authURL: options.authURL,
        redirectURI: options.redirectURI,
        clientId: options.clientId
      }, jasmine.any(Function), jasmine.any(Function));
    });
    it('should stop listening if initAuthData fails', function() {
      adobeDPS.oauthRedirectService._initError();
      expect(adobeDPS.oauthRedirectService.stopListening).toHaveBeenCalled();
      expect(adobeDPS.oauthRedirectService.stopListening.calls.count()).toEqual(2);
    });
    it('should start listening if initAuthData succeeds', function() {
      adobeDPS.oauthRedirectService._initSuccess();
      expect(adobeDPS.oauthRedirectService.startListening).toHaveBeenCalled();
    });
    it('should open a dialog if initilization succeeds', function() {
      spyOn(adobeDPS.dialogService,'open');
      adobeDPS.oauthRedirectService._initSuccess();
      adobeDPS.oauthRedirectService._startSetup();
      expect(adobeDPS.dialogService.open).toHaveBeenCalledWith(
        options.authURL + '/login/with/' + options.service
        + '?appId=' + encodeURIComponent(options.clientId)
        + '&redirect_uri=' + options.redirectURI
      );
    });
    it('should close the open dialog on listening success', function() {
      spyOn(adobeDPS.dialogService,'close');
      adobeDPS.oauthRedirectService._initSuccess();
      adobeDPS.oauthRedirectService._startSetup();
      adobeDPS.oauthRedirectService._startSuccess({});
      expect(adobeDPS.dialogService.close).toHaveBeenCalled();
    });
    it('should stop listening on error', function() {
      adobeDPS.oauthRedirectService._initSuccess();
      adobeDPS.oauthRedirectService._startSetup();
      adobeDPS.oauthRedirectService._startSuccess({ error: "error" });
      expect(adobeDPS.oauthRedirectService.stopListening).toHaveBeenCalled();
      expect(adobeDPS.oauthRedirectService.stopListening.calls.count()).toEqual(2);
    });
    it('should stop listening on timeout', function() {
      adobeDPS.oauthRedirectService._initSuccess();
      adobeDPS.oauthRedirectService._startSetup();
      adobeDPS.oauthRedirectService._startSuccess({ timeout: "timeout" });
      expect(adobeDPS.oauthRedirectService.stopListening).toHaveBeenCalled();
      expect(adobeDPS.oauthRedirectService.stopListening.calls.count()).toEqual(2);
    });
    it('should call authenticationService.login on success with the authtoken', function() {
      spyOn(adobeDPS.authenticationService,'login');
      adobeDPS.oauthRedirectService._initSuccess();
      adobeDPS.oauthRedirectService._startSetup();
      adobeDPS.oauthRedirectService._startSuccess({ auth_token: "auth_token" });
      expect(adobeDPS.authenticationService.login).toHaveBeenCalledWith(null, null, "auth_token");
    });
  });
});
