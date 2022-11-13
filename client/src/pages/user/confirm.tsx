import type { GetServerSideProps } from 'next';
import {setToken} from '@/api/userToken';
import type { NextPage } from 'next';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // tokenを取得
  const token = String(ctx.query.token);
  const tokenFlg = await setToken(token);
  console.log(tokenFlg)

  if (tokenFlg.code === 200) {
    // 正常処理
    return {
      redirect: {
        permanent: true,
        destination: '/user/infomation',
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

const Register: NextPage = ({data}: any) => {
  return (
    <>
      a
    </>
  )
}
export default Register
