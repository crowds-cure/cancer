import { connect } from 'react-redux';
import SessionSummary from './SessionSummary.js';

const mapStateToProps = state => {
  return {
    current: state.user.current,
    measurementsInCurrentSession: state.session.measurementsInCurrentSession
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
