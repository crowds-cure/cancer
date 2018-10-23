const defaultButtons = [
  {
    command: 'PanTool',
    type: 'tool',
    text: 'Pan',
    svgUrl: '/icons.svg#icon-tools-pan',
    active: false
  },
  {
    command: 'WwwcTool',
    type: 'tool',
    text: 'Levels',
    svgUrl: '/icons.svg#icon-tools-levels',
    active: true
  },
  {
    command: 'ZoomTool',
    type: 'tool',
    text: 'Zoom',
    svgUrl: '/icons.svg#icon-tools-zoom',
    active: false
  },
  {
    command: 'LengthTool',
    type: 'tool',
    text: 'Length',
    svgUrl: '/icons.svg#icon-tools-measure-temp',
    active: false
  },
  {
    command: 'StackScrollTool',
    type: 'tool',
    text: 'Stack Scroll',
    svgUrl: '/icons.svg#icon-tools-stack-scroll',
    active: false
  },
  {
    command: 'ClearAll',
    type: 'command',
    text: 'Clear',
    svgUrl: '/icons.svg#icon-tools-reset',
    active: false
  }
];

const tools = (state = { buttons: defaultButtons }, action) => {
  switch (action.type) {
    case 'SET_ACTIVE':
      const item = state.buttons.find(button => button.command === action.tool);

      let buttons = [];

      if (item.type === 'tool') {
        buttons = state.buttons.map(button => {
          if (button.command === action.tool) {
            button.active = true;
          } else if (button.type === 'tool') {
            button.active = false;
          }

          return button;
        });
      }

      return {
        buttons
      };
    default:
      return state;
  }
};

export default tools;
