import axios from 'axios';
import { showAlert } from './alerts';
const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      // url: 'http://127.0.0.1:8000/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Your account was successfully created');
      window.setTimeout(() => {
        location.assign('/');
      }, 2000);
      // console.log(res);
    }
  } catch (err) {
    // console.log(err);
    showAlert('error', err.response.data.message);
  }
};
export default signup;
