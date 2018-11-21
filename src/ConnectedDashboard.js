import { connect } from 'react-redux';
import Dashboard from './Dashboard.js';
import { setTotalCompleteCollection } from './state/actions.js';

const mapStateToProps = state => {
  return {
    username: state.user.username,
    current: state.user.current
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setTotalCompleteCollection: num => dispatch(setTotalCompleteCollection(num))
  };
};

const ConnectedDashboard = connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);

export default ConnectedDashboard;
