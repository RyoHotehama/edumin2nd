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
import {setuserRegister} from '@/api/userRegister';
import {Encryption} from '@/components/encryption';
import { useRouter } from 'next/router';
import { useState } from 'react';

// フォームの型
interface FormInput {
  email: string
  password: string
}

// バリデーションルール
const schema = yup.object({
  email: yup
    .string()
    .required('必須です')
    .email('正しいメールアドレス形式で入力して下さい'),
  password: yup
    .string()
    .required('必須です')
    .min(6, '6文字以上で設定して下さい')
});

export default function Register() {
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

    const userData = await setuserRegister(data);
    if (userData.code == 200) {
      router.push({
        pathname: '/user/tentative',
      });
    } else if (userData.code == 400) {
      setMailErr(userData.data.errors.email);
      if (userData.data.errors.email) {
        setMailErrFlg(true);
      }
      setPasswordErr(userData.data.errors.password);
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
        <Typography variant='h5' sx={{marginBottom: 3}}>
          簡単無料会員登録
        </Typography>
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
          {mailErr &&
            <Typography component='p' color='error' variant='subtitle2'>
              {mailErr}
            </Typography>
          }
          <TextField
            required
            label="パスワード"
            type="password"
            {...register('password')}
            error={"password" in errors || passwordErrFlg}
            helperText={errors.password?.message}
            onChange={() => passwordHandleChange()}
          />
          {passwordErr &&
            <Typography component='p' color='error'>
              {passwordErr}
            </Typography>
          }
          <Button color="primary" variant="contained" size="large" onClick={handleSubmit(onSubmit)}>
            会員登録
          </Button>
          <Typography component='div' sx={{textAlign: 'center'}}>
            <Link href={{pathname: '/'}} passHref>
              ログインはこちら
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Container>
  )
}
