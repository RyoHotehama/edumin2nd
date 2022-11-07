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

// フォームの型
interface FormInput {
  name: string
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
  const {register, handleSubmit, formState: { errors }} = useForm<FormInput>({
    resolver: yupResolver(schema)
  });
  // フォーム送信時の処理
  const onSubmit: SubmitHandler<FormInput> = (data) => {
    // バリデーションチェックOK！なときに行う処理を追加
    console.log(data)
  };
  return (
    <Container maxWidth='sm'>
      <Image
        src={'/logo.png'}
        alt='ロゴ画像'
        width={250}
        height={100}
        objectFit='contain'
        style={{display: 'block', margin: '100px auto 30px auto'}}
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
            error={"email" in errors}
            helperText={errors.email?.message}
          />
          <TextField
            required
            label="パスワード"
            type="password"
            {...register('password')}
            error={"password" in errors}
            helperText={errors.password?.message}
          />
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
