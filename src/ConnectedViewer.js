import { connect } from 'react-redux';
import {
  fetchCaseRequest,
  fetchCaseSuccess,
  fetchCaseFailure,
  incrementNumMeasurementsInSession,
  resetSession
} from './state/actions.js';
import Viewer from './viewer/Viewer.js';

const mapStateToProps = state => {
  const activeTool = state.tools.buttons.find(button => {
    return button.type === 'tool' && button.active === true;
  });

  return {
    username: state.user.username,
    isFetching: state.cases.isFetching,
    error: state.cases.error,
    caseData: state.cases.caseData,
    activeTool: activeTool.command,
    measurementsInCurrentSession: state.session.measurementsInCurrentSession,
    totalCompleteCollection: state.session.totalCompleteCollection,
    collection: state.collection.name,
    sessionStart: state.session.start,
    current: state.user.current
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchCaseRequest: () => dispatch(fetchCaseRequest()),
    fetchCaseSuccess: response => dispatch(fetchCaseSuccess(response)),
    fetchCaseFailure: error => dispatch(fetchCaseFailure(error)),
    incrementNumMeasurementsInSession: num =>
      dispatch(incrementNumMeasurementsInSession(num)),
    resetSession: () => dispatch(resetSession())
  };
};

const ConnectedViewer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Viewer);

export default ConnectedViewer;
