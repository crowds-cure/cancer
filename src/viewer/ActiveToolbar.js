import { connect } from 'react-redux';
import { setToolActive } from '../state/actions.js';
import ToolbarSection from './components/ToolbarSection.js';

const mapStateToProps = state => {
  return {
    buttons: state.tools.buttons
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setToolActive: id => dispatch(setToolActive(id))
  };
};

const ActiveToolbar = connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolbarSection);

export default ActiveToolbar;
