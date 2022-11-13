import axios from '@/libs/axios';

// フォームの型
interface FormInput {
  email: string
  password: string
}

export const setuserRegister = async (params: FormInput) => {
  try {
    const response = await axios.post('/api/user/regist',
    {
      email: params.email,
      password: params.password
    })
    const userRegister = {
      data: response.data,
      code: response.status
    }

    return userRegister
  } catch (err: any) {
    const response = {
      data: err.response.data,
      code: err.response.status
    }

    return response
  }
}
