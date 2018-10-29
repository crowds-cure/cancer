import { connect } from 'react-redux';
import SessionSummary from './SessionSummary.js';

const mapStateToProps = state => {
  return {
    current: state.user.current,
    casesInCurrentSession: state.session.casesInCurrentSession
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

const ConnectedSessionSummary = connect(
  mapStateToProps,
  mapDispatchToProps
)(SessionSummary);

export default ConnectedSessionSummary;
