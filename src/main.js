// custom selector function
const $ = (selector) => document.querySelector(selector);

// form fields to populate data
// const population = $('#population');
// const timeToElapse = $('#timeToElapse');
// const reportedCases = $('#reportedCases');
// const totalHostpitalBeds = $('#totalHostpitalBeds');
// const periodType = $('#periodType');

// handle form submition
const form = $('#impact-form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  return data;
});
