export default function getUsername() {
  console.log(JSON.stringify(window.auth.profile));
  return window.auth.profile.username;
}
