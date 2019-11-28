// See https://github.com/IdentityModel/oidc-client-js/wiki for more information
import Oidc from 'oidc-client';
import Rollbar from '../shared/ErrorHandling.js';

Oidc.Log.logger = console;
Oidc.Log.level = Oidc.Log.DEBUG;

export default class Auth {
  constructor() {
    const oidcClient = {
      authServerUrl: 'https://cancer.crowds-cure.org/auth/realms/dcm4che',
      clientId: 'crowds-cure-cancer',
      authRedirectUri: '/',
      postLogoutRedirectUri: '/logout-redirect.html',
      responseType: 'id_token token',
      scope: 'email profile openid',
      revokeAccessTokenOnSignout: true,
      extraQueryParams: {
        kc_idp_hint: 'crowds-cure-cancer-auth0-oidc',
        client_id: 'crowds-cure-cancer'
      }
    };

    this.extraQueryParams = oidcClient.extraQueryParams;

    const settings = {
      authority: oidcClient.authServerUrl,
      client_id: oidcClient.clientId,
      redirect_uri: Auth.absoluteURL(oidcClient.authRedirectUri),
      silent_redirect_uri: Auth.absoluteURL('/silent-refresh.html'),
      post_logout_redirect_uri: Auth.absoluteURL(
        oidcClient.postLogoutRedirectUri
      ),
      response_type: oidcClient.responseType,
      scope: 'email profile openid', // Note: Request must have scope 'openid' to be considered an OpenID Connect request
      automaticSilentRenew: true,
      revokeAccessTokenOnSignout: true,
      extraQueryParams: oidcClient.extraQueryParams
    };

    this.oidcUserManager = new Oidc.UserManager(settings);

    this.oidcUserManager.events.addSilentRenewError(
      this.handleSilentRenewError
    );

    this.oidcUserManager.events.addUserLoaded(this.handleUserLoaded);

    this.oidcUserManager.events.addAccessTokenExpired(this.logout);
  }

  static removeHash() {
    const { history } = window;

    // TODO: Find a way to remove the #state=... from the browser history so it's not the entry that shows up when you press Back.
    history.pushState(
      '',
      document.title,
      window.location.pathname + window.location.search
    );
  }

  /**
   * Check if the current window location contains an OAuth
   * sign-in response.
   *
   * @return {boolean} True if the URL contains an OAuth
   *                   sign-in response (e.g. &state=...)
   */
  static urlHasSignInResponse() {
    const hash = window.location.hash.substring(1);
    const params = {};

    hash.split('&').forEach(hk => {
      const temp = hk.split('=');
      params[temp[0]] = temp[1];
    });

    return !!params.state;
  }

  static absoluteURL(relativeUrl) {
    return new URL(relativeUrl, window.location.href).href;
  }

  handleSilentRenewError = error => {
    if (error.error === 'login_required') {
      this.logout();
    }
  };

  getProfile = () => {
    return this.profile;
  };

  async processSignInResponse() {
    await this.oidcUserManager.signinRedirectCallback();

    Auth.removeHash();
  }

  handleAuthentication = async () => {
    if (Auth.urlHasSignInResponse() === false) {
      throw new Error('SignIn response is not present in the location.');
    }

    await this.processSignInResponse();
    const authResult = await this.oidcUserManager.getUser();

    this.setSession(authResult);
  };

  handleUserLoaded = async () => {
    const authResult = await this.oidcUserManager.getUser();

    this.setSession(authResult);
  };

  isAuthenticated = () => {
    return new Date().getTime() < this.expiresAt;
  };

  login = args => {
    args.extraQueryParams =
      args.extraQueryParams || this.extraQueryParams || {};
    args.extraQueryParams.hash = window.location.hash;

    debugger;

    return this.oidcUserManager.signinRedirect(args);
  };

  logout = () => {
    // clear tokens and expiration
    this.idToken = null;
    this.accessToken = null;
    this.expiresAt = null;
    this.profile = null;

    return this.oidcUserManager.signoutRedirect();
  };

  setSession = authResult => {
    this.idToken = authResult.id_token;
    this.accessToken = authResult.access_token;
    this.profile = authResult.profile;

    // set the time that the id token will expire at
    this.expiresAt = authResult.expires_at * 1000 + new Date().getTime();

    // TODO: Create some sort of setSession callbacks instead
    Rollbar.configure({
      payload: {
        person: {
          id: this.profile.jti,
          username: this.profile.username,
          email: this.profile.email
        }
      }
    });
  };
}
