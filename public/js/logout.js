import axios from 'axios';
import { showAlert } from './alerts';

const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
      // url: 'http://127.0.0.1:8000/api/v1/users/logout',
    });
    if (res.data.status === 'success') {
      location.assign('/');
    }
  } catch (err) {
    showAlert('error', 'Error logging out! Try again.');
  }
};
export default logout;
