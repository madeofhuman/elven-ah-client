import toastr from 'toastr';
import {
  IS_LOADING,
  SIGNUP_FAILED,
  VALIDATION_ERROR,
  IS_COMPLETE,
} from '../../../shared/constants/ActionTypes';
import fetchData from '../../../shared/utilities/fetchData';

const signupUser = user => async (dispatch) => {
  const { password, confirmPassword } = user;
  if (confirmPassword !== password) {
    const errors = {};
    errors.message = 'Validation Error(s)';
    errors.confirmPassword = ['Confirm Password does not match Password'];
    dispatch({ type: VALIDATION_ERROR, errors });
    return null;
  }
  dispatch({ type: IS_LOADING });
  try {
    const response = await fetchData({
      url: '/auth/signup',
      method: 'post',
      data: user,
    });
    dispatch({ type: IS_COMPLETE });
    if (response.status === 201) {
      toastr.success(response.data.message);
      return response;
    }
    if (response.status === 400 || response.status === 409) {
      const { errors } = response.data;
      errors.message = 'Validation Error(s)';
      dispatch({ type: VALIDATION_ERROR, errors });
      return null;
    }
    const errors = response.data;
    dispatch({ type: SIGNUP_FAILED, errors: { errors } });
    return null;
  } catch (error) {
    return toastr.error('Unable to connect to the Internet, please check your connection and try agian...');
  }
};

export default signupUser;
