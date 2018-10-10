// See https://github.com/IdentityModel/oidc-client-js/wiki for more information
import Oidc from 'oidc-client';

Oidc.Log.logger = console;
Oidc.Log.level = Oidc.Log.DEBUG;

export default class Auth {
  constructor() {
    const oidcClient = {
      authServerUrl: 'https://k8s-testing.ohif.org/auth/realms/dcm4che',
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

    this.getProfile = this.getProfile.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.setSession = this.setSession.bind(this);
    this.handleSilentRenewError = this.handleSilentRenewError.bind(this);

    this.oidcUserManager.events.addSilentRenewError(
      this.handleSilentRenewError
    );
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

  handleSilentRenewError(error) {
    if (error.error === 'login_required') {
      this.logout();
    }
  }

  getProfile() {
    return this.profile;
  }

  async processSignInResponse() {
    await this.oidcUserManager.signinRedirectCallback();

    Auth.removeHash();
  }

  async handleAuthentication() {
    if (Auth.urlHasSignInResponse() === false) {
      throw new Error('SignIn response is not present in the location.');
    }

    await this.processSignInResponse();
    const authResult = await this.oidcUserManager.getUser();

    this.setSession(authResult);
  }

  isAuthenticated() {
    return new Date().getTime() < this.expiresAt;
  }

  login(args) {
    return this.oidcUserManager.signinRedirect(args);
  }

  logout() {
    // clear tokens and expiration
    this.idToken = null;
    this.accessToken = null;
    this.expiresAt = null;
    this.profile = null;

    return this.oidcUserManager.signoutRedirect();
  }

  setSession(authResult) {
    this.idToken = authResult.id_token;
    this.accessToken = authResult.access_token;
    this.profile = authResult.profile;
    // set the time that the id token will expire at
    this.expiresAt = authResult.expires_at * 1000 + new Date().getTime();
  }
}
