import React, { FC } from 'react';
import Head from 'next/head';
import { Flex, Container, Box } from 'theme-ui';

import Page from '../../../components/PageFrame';
import PageHeader from '../../../components/PageHeader';
import ManageSidebar from '../../../components/ManageSidebar';
import { workspaceLinks } from '../../../utils';
import PermissionsList from '../../../components/manage/PermissionsList';
import { useAuth } from '../../../contexts/AuthContext';

const Index: FC = () => {
  const { userProfile } = useAuth();
  return (
    (userProfile?.currentOrganisation?.name !== 'Personal' || '') && (
      <>
        <Head>
          <title>Layouts | Wraft Docs</title>
          <meta name="description" content="a nextjs starter boilerplate" />
        </Head>
        <Page>
          <PageHeader
            title="Manage Permissions"
            desc="Manage > Workspace"></PageHeader>
          <Container
            sx={{
              pt: 0,
              height: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              bg: 'background',
            }}>
            <Flex>
              <ManageSidebar items={workspaceLinks} />
              <Box
                sx={{
                  width: '100%',
                  bg: 'bgWhite',
                  border: '1px solid',
                  borderColor: 'neutral.1',
                  borderRadius: 4,
                  m: 4,
                }}>
                <PermissionsList />
              </Box>
            </Flex>
          </Container>
        </Page>
      </>
    )
  );
};

export default Index;
