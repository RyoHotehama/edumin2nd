import Head from 'next/head';
import Header from '@/layout/header';
import React, { ReactNode } from 'react';
import Box from '@mui/material/Box';

type Props = {
  children?: ReactNode;
};

const Layout: React.FC<Props> = ({ children }: Props) => {
  return (
    <>
      <Head>
        <title>Edumin</title>
        <meta charSet='utf-8' />
      </Head>
      <Header />
      <Box sx={{paddingTop: 8}}>
        <main>{children}</main>
      </Box>
    </>
  )
};
export default Layout;