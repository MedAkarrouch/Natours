export const showAlert = (type, msg, time = 3) => {
  // type is either success or error
  hideAlert();
  const div = document.createElement('div');
  div.classList = `alert alert--${type}`;
  div.textContent = msg;
  document.querySelector('body').insertAdjacentElement('afterbegin', div);
  window.setTimeout(hideAlert, time * 1000);
};
export const hideAlert = () => {
  const div = document.querySelector('.alert');
  if (div) div.parentElement.removeChild(div);
};
