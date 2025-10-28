import React from 'react';
import { Layout } from 'antd';
import TradingBotHeader from './Header';
import TradingBotFooter from './Footer';
import { Content } from 'antd/es/layout/layout';

interface DefaultLayoutProps {
  children: React.ReactNode;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  return (
    <Layout className="min-h-screen">
      <TradingBotHeader />
      <Content className="p-2 drop-shadow rounded-lg bg-white">{children}</Content>
      <TradingBotFooter />
    </Layout>
  );
};

export default DefaultLayout;
