import { connect } from 'react-redux';
import {
  fetchCaseRequest,
  fetchCaseSuccess,
  fetchCaseFailure
} from './state/actions.js';
import Viewer from './viewer/Viewer.js';

const mapStateToProps = state => {
  const activeTool = state.tools.buttons.find(button => {
    return button.type === 'tool' && button.active === true;
  });

  if (!state.cases) {
    return {
      isFetching: true,
      caseData: null,
      activeTool: activeTool.command
    };
  }

  return {
    isFetching: state.cases.isFetching,
    caseData: state.cases.caseData,
    activeTool: activeTool.command
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchCaseRequest: () => dispatch(fetchCaseRequest()),
    fetchCaseSuccess: response => dispatch(fetchCaseSuccess(response)),
    fetchCaseFailure: error => dispatch(fetchCaseFailure(error))
  };
};

const ConnectedViewer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Viewer);

export default ConnectedViewer;
