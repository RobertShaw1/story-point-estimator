const $ = document;

const { readyState } = $;
const ready = readyState === 'interactive' || readyState === 'complete';

const state = {
  selectedValues: [
    {factor: 'Complexity', level: null},
    {factor: 'Effort', level: null},
    {factor: 'Uncertainty', level: null},
  ],
  storyPointTotal: 0,
};

if (ready) {
  getUserInput();
}

function getUserInput() {
  const unassignedFactor = getUnassignedFactor();

  if (unassignedFactor) {
    $.getElementById('factor').innerHTML = unassignedFactor;
    registerLevelButtons(unassignedFactor);
  }

}

function getUnassignedFactor() {
  const { selectedValues } = state;

  for (let i = 0; i < selectedValues.length; i++) {
    if (!selectedValues[i].level) return selectedValues[i].factor;
  }
}

function registerLevelButtons() {
  const container = $.getElementById('levels');
  let button = container.firstElementChild;

  for (let i = 0; i < container.childElementCount; i++) {
    button.addEventListener('click', setState);
    button = button.nextElementSibling;
  }
}

function setState() {
  const { selectedValues } = state;

  for (let i = 0; i < selectedValues.length; i++) {
    if (!selectedValues[i].level) {
      selectedValues[i].level = this.title;
      break;
    }
  }

  if (!selectedValues[2].level) {
    getUserInput();
  } else {
    calculateStoryPoints();
  }
}

function SPEstimator () {
  this.smallUncertainty = 0.25;
  this.mediumUncertainty = this.smallUncertainty * 13;
  this.largeUncertainty = this.mediumUncertainty * 2;

  this.smallComplexity = 1;
  this.mediumComplexity = this.smallComplexity * 2;
  this.largeComplexity = this.mediumComplexity * 2;

  this.smallEffort = 0.5;
  this.mediumEffort = this.smallEffort * 2;
  this.largeEffort = this.mediumEffort * 5;

  this.storyPoints = 0;
}

SPEstimator.prototype.calculateStoryPoints = function(input) {
  const estimator = this;

  const rawNum = input.reduce((total, selection) => {
    const _key = `${selection.level}${selection.factor}`;
    const estimate = estimator[_key];
    total = total + estimate;
    return total;
  }, 0)

  /*eslint-disable complexity */
  const convert = num => {
    if (2 < num && num < 3) return 2;
    else if (3 < num && num < 5) return 3;
    else if (5 < num && num < 8) return 5;
    else if (8 < num && num <= 11) return 8;
    else if (num > 11) return 13;
    return 1;
  }
  /*eslint-enable complexity */

  estimator.storyPoints = convert(rawNum);
}

function calculateStoryPoints() {
  const estimator = new SPEstimator();
  estimator.calculateStoryPoints(state.selectedValues);

  state.storyPointTotal = estimator.storyPoints;
  displayStoryPointTotal();
}

function displayStoryPointTotal() {
  if (state.storyPointTotal) {
    const inputs = $.getElementsByClassName('input');
    inputs[0].style.display = 'none';
    inputs[1].style.display = 'none';

    const levelItems = $.getElementsByClassName('level-item');
    for (let i = 0; i < levelItems.length; i++) {
      const str = state.selectedValues[i].level;
      const _text = `${str[0].toUpperCase()}${str.slice(1)}`;
      levelItems[i].innerHTML = _text;
    }

    const spNum = $.getElementsByClassName('sp-num');
    spNum[0].innerHTML = state.storyPointTotal;

    const outputs = $.getElementsByClassName('output');
    outputs[0].style.display = 'initial';
    outputs[1].style.display = 'initial';

  }
}
