import axios from 'axios';
import { showAlert } from './alerts';
const updateSettings = async (data, type) => {
  try {
    const route = type === 'Data' ? 'updateMe' : 'updateMyPassword';
    // console.log(route);
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/${route}`,
      // url: `http://127.0.0.1:8000/api/v1/users/${route}`,
      data,
    });
    // console.log('res', res);
    if (res.data.status === 'success') {
      showAlert('success', `${type} successfully updated`);
      window.setTimeout(() => {
        location.reload(true);
      }, 2000);
    }
  } catch (err) {
    // console.log(err);
    // console.log(err.response.data.message);
    showAlert('error', err.response.data.message);
  }
};
export default updateSettings;
