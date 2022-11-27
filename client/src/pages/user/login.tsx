import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Image from 'next/image';
import Link from 'next/link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import * as yup from 'yup';
import {SubmitHandler, useForm} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {checkLogin} from '@/api/checkLogin';
import {Encryption} from '@/components/encryption';
import { useRouter } from 'next/router';
import { useState } from 'react';
import type { NextPage } from 'next';

// フォームの型
interface FormInput {
  email: string
  password: string
}

// バリデーションルール
const schema = yup.object({
  email: yup
    .string()
    .required('メールアドレスを入力して下さい')
    .email('正しいメールアドレス形式で入力して下さい'),
  password: yup
    .string()
    .required('パスワードを入力して下さい')
});

const Login: NextPage = () => {
  const router = useRouter();
  const [mailErrFlg, setMailErrFlg] = useState<boolean>(false);
  const [mailErr, setMailErr] = useState<string>();
  const [passwordErrFlg, setPasswordErrFlg] = useState<boolean>(false);
  const [passwordErr, setPasswordErr] = useState<string>();
  const {register, handleSubmit, formState: { errors }} = useForm<FormInput>({
    resolver: yupResolver(schema)
  });
  const emailHandleChange = () => {
    setMailErrFlg(false);
    setMailErr('');
  }
  const passwordHandleChange = () => {
    setPasswordErr('')
    setPasswordErrFlg(false);
  }
  // フォーム送信時の処理
  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    // エンコード
    data.email = Encryption(data.email);
    data.password = Encryption(data.password);
    const message = 'メールアドレスまたはパスワードが違います。';

    const userData = await checkLogin(data);
    if (userData.code == 200) {
      router.push({
        pathname: '/',
      });
    } else if (userData.code == 400) {
      setMailErr(userData.data.errors.email);
      setPasswordErr(userData.data.errors.password);
      if (userData.data.errors.email) {
        setMailErrFlg(true);
      }
      if (userData.data.errors.email == message || userData.data.errors.password == message) {
        setMailErrFlg(true);
        setPasswordErrFlg(true);
      }
      if (userData.data.errors.password) {
        setPasswordErrFlg(true);
      }
    } else {
      router.push({
        pathname: '/error',
      });
    }
  };

  return (
    <Container maxWidth='sm'>
      <Image
        src={'/logo.png'}
        alt='ロゴ画像'
        width={250}
        height={100}
        // objectFit='contain'
        style={{display: 'block', margin: '0 auto 30px auto'}}
      />
      <Paper elevation={5} sx={{padding: 5}}>
        <Typography variant='h5' sx={{marginBottom: 1}}>
          ログイン
        </Typography>
          {(() => {
            if (mailErr || passwordErr) {
              return (
                <Typography component='p' color='error' variant='subtitle2' sx={{marginBottom: 2}}>
                  メールアドレスまたはパスワードが違います。
                </Typography>
              )
            }
          }
          )()}
        <Stack spacing={3}>
          <TextField
            required
            label="メールアドレス"
            type="email"
            {...register('email')}
            error={"email" in errors || mailErrFlg}
            helperText={errors.email?.message}
            onChange={() => emailHandleChange()}
          />
          <TextField
            required
            label="パスワード"
            type="password"
            {...register('password')}
            error={"password" in errors || passwordErrFlg}
            helperText={errors.password?.message}
            onChange={() => passwordHandleChange()}
          />
          <Button color="primary" variant="contained" size="large" onClick={handleSubmit(onSubmit)}>
            ログイン
          </Button>
          <Typography component='div' sx={{textAlign: 'center'}}>
            <Link href={{pathname: '/user/register'}} passHref>
              会員登録はこちら
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Container>
  )
}
export default Login
