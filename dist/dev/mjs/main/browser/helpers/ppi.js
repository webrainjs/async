let _ppi = null;
export function getPPI() {
  if (!_ppi) {
    // create an empty element
    const div = document.createElement('div'); // give it an absolute size of one inch

    div.style.width = '1in'; // append it to the body

    const {
      body
    } = window.document;
    body.appendChild(div); // read the computed width

    const ppi = document.defaultView.getComputedStyle(div, null).getPropertyValue('width'); // remove it again

    body.removeChild(div); // and return the value

    _ppi = parseFloat(ppi);
  }

  return _ppi;
}