import axios from 'axios';
import { showAlert } from './alerts';

const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      // url: `https://${window.location.hostname}/api/v1/users/login`,
      url: 'https://natours-production-f8c9.up.railway.app/api/v1/users/login',
      // url: 'http://127.0.0.1:8000/api/v1/users/login',
      data: {
        email,
        password,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 2000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
export default login;
