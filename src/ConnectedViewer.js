import { connect } from 'react-redux';
import {
  fetchCaseRequest,
  fetchCaseSuccess,
  fetchCaseFailure,
  incrementNumMeasurementsInSession
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
    sessionStart: state.session.start
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchCaseRequest: () => dispatch(fetchCaseRequest()),
    fetchCaseSuccess: response => dispatch(fetchCaseSuccess(response)),
    fetchCaseFailure: error => dispatch(fetchCaseFailure(error)),
    incrementNumMeasurementsInSession: num =>
      dispatch(incrementNumMeasurementsInSession(num))
  };
};

const ConnectedViewer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Viewer);

export default ConnectedViewer;
