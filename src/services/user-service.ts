import { UserLoginData, UserRegisterData } from '@/types/user';
import request from './request';
const register = async (data: UserRegisterData) => {
  return request({
    url: '/api/users/register',
    method: 'post',
    data,
  });
};

const login = async (data: UserLoginData) => {
  const formData = new URLSearchParams();
  formData.append('username', data.username);
  formData.append('password', data.password);
  return request({
    url: '/api/users/login',
    method: 'post',
    data: formData,
  });
};

const getCurrentUser = async () => {
  return request({
    url: '/api/users/me',
    method: 'get',
  });
};

export { getCurrentUser, login, register };
