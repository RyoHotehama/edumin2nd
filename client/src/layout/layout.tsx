import Head from 'next/head';
import Header from '@/layout/header';
import React, { ReactNode } from 'react';

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
      <main>{children}</main>
    </>
  )
};
export default Layout;