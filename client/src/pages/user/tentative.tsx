import type { NextPage } from 'next';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import type { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const referer = ctx.req.headers.referer;
  const url = process.env.NEXT_PUBLIC_URL + '/user/register';

  // 特定のURLでない場合エラー画面へ
  if (referer != url) {
    return {
      redirect: {
        permanent: true,
        destination: '/error',
      },
    };
  }

  return {
    props: {
      data: referer
    },
  };
};

const Tentative: NextPage = () => {
  return (
    <Container maxWidth='lg'>
      <Grid container sx={{height: '80vh',justifyContent: 'center', alignItems: 'center'}}>
        <Grid>
          <Typography variant='h5' sx={{textAlign:'center', marginBottom: 5}}>
            仮登録が完了致しました。
          </Typography>
          <Typography variant='h5'>
            メールをご確認ください。
          </Typography>
        </Grid>
      </Grid>
    </Container>
  )
}
export default Tentative
