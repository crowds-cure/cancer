import { connect } from 'react-redux';
import {
  fetchCaseRequest,
  fetchCaseSuccess,
  fetchCaseFailure,
  incrementNumCasesInSession
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
    casesInCurrentSession: state.session.casesInCurrentSession
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchCaseRequest: () => dispatch(fetchCaseRequest()),
    fetchCaseSuccess: response => dispatch(fetchCaseSuccess(response)),
    fetchCaseFailure: error => dispatch(fetchCaseFailure(error)),
    incrementNumCasesInSession: () => dispatch(incrementNumCasesInSession())
  };
};

const ConnectedViewer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Viewer);

export default ConnectedViewer;
