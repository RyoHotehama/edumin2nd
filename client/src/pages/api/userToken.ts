import axios from '@/libs/axios';

export const setToken = async (token: string) => {
  try {
    const response = await axios.post('/api/user/register',
    {
      token: token
    })
    const tokenCheck = {
      data: response.data,
      code: response.status
    }

    return tokenCheck
  } catch (err: any) {
    const response = {
      data: err.response.data,
      code: err.response.status
    }

    return response
  }
}