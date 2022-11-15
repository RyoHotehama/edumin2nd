import type { GetServerSideProps } from 'next';
import {setToken} from '@/api/userToken';
import type { NextPage } from 'next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // tokenを取得
  const token = String(ctx.query.token);

  // トークンがない場合はエラー処理
  if (!token) {
    return {
      redirect: {
        permanent: true,
        destination: '/error',
      },
    };
  }

  // メール認証確認
  const tokenFlg = await setToken(token);

  // 異常処理
  if (tokenFlg.code != 200 && tokenFlg.code != 400) {
    return {
      redirect: {
        permanent: true,
        destination: '/error',
      },
    };
  }

  return {
    props: {
      data: {
        token: tokenFlg.data,
      },
    },
  };
};

const Confirm: NextPage = ({data}: any) => {
  return (
    <Container maxWidth='lg'>
      <Grid container sx={{height: '80vh',justifyContent: 'center', alignItems: 'center'}}>
        <Grid>
          <Typography variant='h6' sx={{textAlign:'center', marginBottom: 5}}>
            {data.token}
          </Typography>
          <Box sx={{textAlign:'center', marginTop: 5, marginBottom: 5}}>
            {data.token == 'このメールアドレスはすでに認証されています。ログインを行なって下さい。' || data.token == '登録完了しました。ログインを行なって下さい。'
            ?
              <Button variant='outlined' size='large' href='/user/login' color='inherit'>ログインへ</Button>
            :
              <Button variant='outlined' size='large' href='/user/register' color='inherit'>会員登録へ</Button>
            }
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}
export default Confirm
