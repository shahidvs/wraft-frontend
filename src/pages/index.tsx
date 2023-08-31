import { FC } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { Text, Box, Flex, Container } from 'theme-ui';
import Page from '../components/PageFrame';
import { useStoreState } from 'easy-peasy';
import UserNav from '../components/UserNav';
// import UserHome from '../components/UserHome';
import ContentTypeDashboard from '../components/ContentTypeDashboard';
const UserHome = dynamic(() => import('../components/UserHome'),{ssr: false})

const Index: FC = () => {
  const token = useStoreState((state) => state.auth.token);
  return (
    <>
      <Head>
        <title>Wraft - The Document Automation Platform</title>
        <meta
          name="description"
          content="Wraft is a document automation and pipelining tools for businesses"
        />
      </Head>
      {!token && (
        <Box>
          <UserNav />
          <UserHome />
        </Box>
      )}
      {token && (
        <Page>
          <Container variant="layout.pageFrame">
            <Box pb={3} pt={4} sx={{}}>
              {/* <Text variant="pagetitle" pb={0} mb={1}>
              Quick Start s
            </Text> */}
              <Text sx={{ color: 'gray.7', fontSize: 1, pt: 0 }}>
                Get started with templates
              </Text>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Flex>
                <ContentTypeDashboard />
              </Flex>
            </Box>
            <Flex sx={{ width: '100%' }}>
              <Box sx={{ pb: 4, width: '55%' }}>
                <Box sx={{ py: 3, color: 'gray.5', fontSize: 1 }}>
                  <Text color="gray.7">Pending Actions</Text>
                </Box>
                <Box>{/* <ApprovalList /> */}</Box>
              </Box>
              <Box sx={{ pb: 4, width: '45%', pl: 4 }}>
                <Box sx={{ py: 3, color: 'gray.5', fontSize: 1 }}>
                  <Text color="gray.7">Activities</Text>
                </Box>
                {/* <ActivityFeed /> */}
              </Box>
            </Flex>
          </Container>
        </Page>
      )}
    </>
  );
};

export default Index;
