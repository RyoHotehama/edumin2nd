import axios from '@/libs/axios';

export const checkToken = async (token: string) => {
  try {
    const response = await axios.post('/api/user/get/info',
    {
      token: token,
    })
    const userInfo = {
      data: response.data,
      code: response.status
    }

    return userInfo
  } catch (err: any) {
    const response = {
      data: err.response.data,
      code: err.response.status
    }

    return response
  }
}