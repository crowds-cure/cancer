import { connect } from 'react-redux';
import Dashboard from './Dashboard.js';

const mapStateToProps = state => {
  return {
    current: state.user.current
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

const ConnectedDashboard = connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);

export default ConnectedDashboard;
