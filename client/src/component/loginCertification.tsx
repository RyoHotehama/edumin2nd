import {checkToken} from '@/api/checkToken';

export const LoginCertification = async (token: string) => {
  if (!token) {
    return;
  }
  const userInfo = await checkToken(token);
  if (userInfo.code != 200) {
    return;
  }

  return userInfo;
}