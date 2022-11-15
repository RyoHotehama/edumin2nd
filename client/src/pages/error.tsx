import type { NextPage } from 'next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

const Error: NextPage = () => {
  return (
    <Container maxWidth='lg'>
      <Grid container sx={{height: '80vh',justifyContent: 'center', alignItems: 'center'}}>
        <Grid>
          <Typography variant='h5' sx={{textAlign:'center', marginBottom: 5}}>
            アクセスしようとしたページが見つかりませんでした
          </Typography>
          <Box sx={{textAlign:'center', marginTop: 5, marginBottom: 5}}>
            <Typography variant='h5'>
            ご指定のページは削除、変更されたか、現在利用できない可能性があります。
            </Typography>
            <Typography variant='h5'>
              URLをご確認ください。
            </Typography>
          </Box>
          <Box sx={{textAlign:'center', marginTop: 5, marginBottom: 5}}>
            <Button variant='outlined' size='large' href='/' color='inherit'>トップへ</Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}
export default Error
