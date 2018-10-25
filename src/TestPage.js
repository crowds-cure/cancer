import { Component } from 'react';
import React from 'react';
import './TestPage.css';

import SelectTree from './select-tree/SelectTree.js';

var organGroups = [
  'Abdominal/Chest Wall',
  'Adrenal',
  'Bladder',
  'Bone',
  'Brain',
  'Breast',
  'Colon',
  'Esophagus',
  'Extremities',
  'Gallbladder',
  'Kidney',
  'Liver',
  'Lung',
  'Lymph Node',
  'Mediastinum/Hilum',
  'Muscle',
  'Neck',
  'Other: Soft Tissue',
  'Ovary',
  'Pancreas',
  'Pelvis',
  'Peritoneum/Omentum',
  'Prostate',
  'Retroperitoneum',
  'Small Bowel',
  'Spleen',
  'Stomach',
  'Subcutaneous'
];

function nameToID(name) {
  // http://stackoverflow.com/questions/29258016/remove-special-symbols-and-extra-spaces-and-make-it-camel-case-javascript
  return name
    .trim() //might need polyfill if you need to support older browsers
    .toLowerCase() //lower case everything
    .replace(
      /([^A-Z0-9]+)(.)/gi, //match multiple non-letter/numbers followed by any character
      function(match) {
        return arguments[2].toUpperCase(); //3rd index is the character we need to transform uppercase
      }
    );
}

const items = organGroups.map(name => {
  return {
    label: name,
    value: nameToID(name)
  };
});

class TestPage extends Component {
  render() {
    return (
      <div className="TestPage">
        <SelectTree twoColumns={true} items={items} />
      </div>
    );
  }
}

export default TestPage;
