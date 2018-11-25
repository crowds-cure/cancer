import rollbar from 'rollbar';
import version from '../version.js';
import sha from '../sha.js';

// TODO: could make this more robust
const isLocalhost = window.location.origin === 'http://localhost:3000';

const Rollbar = rollbar.init({
  enabled: false, // temporarily to test performance //!isLocalhost,
  accessToken: '0b87c8ddc3b945a08b212efc005337eb',
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    environment: window.location.origin,
    client: {
      javascript: {
        code_version: sha,
        source_map_enabled: true
      }
    }
  }
});

window.Rollbar = Rollbar;
window.version = version;
window.sha = sha;

export default Rollbar;
