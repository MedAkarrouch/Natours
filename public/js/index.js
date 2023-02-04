import '@babel/polyfill';
import login from './login';
import signup from './signup';
import logout from './logout';
import { bookTour } from './stripe';
import updateSettings from './updateSettings';
import { showAlert } from './alerts';
// Variables
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const userDataFrom = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const logoutBtn = document.querySelector('.logout-btn');
const bookTourBtn = document.getElementById('book-tour');
//
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}
if (signupForm) {
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    signup(name, email, password, passwordConfirm);
  });
}
if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}
if (userDataFrom) {
  userDataFrom.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('email', document.getElementById('email').value);
    form.append('name', document.getElementById('name').value);
    form.append('photo', document.getElementById('photo').files[0]);
    updateSettings(form, 'Data');
  });
}
if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', e => {
    e.preventDefault();
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    updateSettings({ passwordCurrent, password, passwordConfirm }, 'Password');
  });
}
if (bookTourBtn) {
  bookTourBtn.addEventListener('click', e => {
    e.target.textContent = 'Processiong...';
    bookTour(e.target.dataset.tourId);
  });
}

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) {
  showAlert('success', alertMessage, 20);
}
