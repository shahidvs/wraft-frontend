import { FC } from 'react';

import Head from 'next/head';

import Page from '../../../../components/PageFrame';
import PipelineView from '../../../../components/PipelineView';
// import { Box } from 'theme-ui';
// import BulkBuild from '../../../src/components/Bu';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Run Pipeline - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        {/* <Box> */}
        <PipelineView />
        {/* <BulkBuild master="" master_id=""/> */}
        {/* </Box> */}
      </Page>
    </>
  );
};

export default Index;
