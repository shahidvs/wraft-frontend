import React, { useEffect, useState } from 'react';
import { Box, Flex, Text } from 'theme-ui';
// import { TrashAlt } from '@styled-icons/boxicons-regular';
import { loadEntity } from '../utils/models';
import { useStoreState } from 'easy-peasy';
import LayoutCard from './Card';

export interface ILayout {
  width: number;
  updated_at: string;
  unit: string;
  slug: string;
  name: string;
  id: string;
  height: number;
  description: string;
}

export interface IField {
  id: string;
  name: string;
  layout_id: string;
  layout: ILayout;
  description: string;
}

export interface IFieldItem {
  name: string;
  type: string;
}

const LayoutList = () => {
  // const token = useSelector(({ login }: any) => login.token);
  // const dispatch = useDispatch();
  const token = useStoreState(state => state.auth.token);

  const [contents, setContents] = useState<Array<IField>>([]);

  /**
   * on Engine Load Success
   * @param data
   */
  const loadLayoutSuccess = (data: any) => {
    const res: IField[] = data.layouts;
    setContents(res);
  };

  /**
   * Load all Engines
   * @param token
   */
  const loadLayout = (token: string) => {
    loadEntity(token, 'layouts', loadLayoutSuccess);
  };

  useEffect(() => {
    if (token) {
      loadLayout(token);
    }
  }, [token]);

  return (
    <Box py={3} mt={4}>
      <Text variant="pagetitle">Layouts</Text>
      <Flex mx={0} mb={3}>
        {contents &&
          contents.length > 0 &&
          contents.map((m: any) => <LayoutCard model='layouts' key={m.id} {...m} />)}
      </Flex>
    </Box>
  );
};
export default LayoutList;
