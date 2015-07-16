# dps-oauth-login

Javascript library for logging into DPS apps using OAuth authentication with 6D's Entitlement Server. After setting up a 3rd party authentication method for your app at http://entitlement-server.6dglobalcloud.com, use this javascript class with a custom DPS library to enable seamless OAuth logins in your app.

## How to install

### Using bower

Use `bower install --save dps-oauth-login` to retrieve the javascript file, and add a script tag to your custom DPS library HTML document, for example:

```html
<script src="path/to/dps-oauth-login.js"></script>
```

### Manual Installation

Add dps-oauth-login.js somewhere accessible by your DPS app (a web server, for example), and add a script tag to your custom DPS library HTML document, for example:

```html
<script src="path/to/dps-oauth-login.js"></script>
```

## How to use

In the custom DPS library HTML document, or in some other javascript file loaded by your custom DPS library, include the following code, making replacements as necessary.

```javascript
var oauthLoginButton = new OAuthLogin({     
  redirectURI : "CUSTOMURI://oauth", // Replace CUSTOMURI the custom URI prefix for your app
  clientId    : "com.domain.adobeappid", // Replace this with your adobe app id
  selector    : "#buttonid", // Selector for elements that a click event will be added to.
  service     : "salesforce" // The OAuth provider name on 6D's entitlement server for your app.
});
```

Note that `redirectURI` and `clientId` are determined through the DPS App Builder. `selector` refers to a CSS selector in your HTML document. `service` should match the name of the authentication method to be used. The authentication method must first be set up for your app on http://entitlement-server.6dglobalcloud.com in your app's settings.
