export default function getAuthorizationHeader() {
  const authString = null;
  const accessToken = window.auth.accessToken;

  const headers = {};
  if (authString) {
    headers.Authorization = `Basic ${btoa(authString)}`;
  } else if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  return headers;
}
