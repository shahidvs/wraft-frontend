import React, { useEffect, useState } from 'react';
import { Box, Flex, Text, Link, Button } from 'theme-ui';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import { File } from './Icons';
import { MarkdownEditor } from './WraftEditor';
import CommentForm from './CommentForm';

import { parseISO, formatDistanceToNow, format } from 'date-fns';

import { Trash, Download } from '@styled-icons/boxicons-regular';

import {
  createEntity,
  loadEntity,
  deleteEntity,
  API_HOST,
} from '../utils/models';
import { useStoreState } from 'easy-peasy';
import { Spinner } from 'theme-ui';
import MenuItem from './MenuItem';

const PreTag = styled(Box)`
  white-space: pre-wrap; /* css-3 */
  white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word;
`;

// const BgGif = styled(Box)`
//   background-image: url(https://i.giphy.com/media/1yT902UqU5fcFxjLbH/200w.webp);
//   height: 100%;
// `

export interface ContentInstance {
  state: State;
  creator: Creator;
  content_type: ContentType;
  content: Content;
}

export interface Content {
  updated_at: Date;
  serialized: Serialized;
  raw: string;
  instance_id: string;
  inserted_at: Date;
  id: string;
  build: string;
}

export interface Serialized {
  title: string;
  body: string;
  serialized: any;
}

export interface ContentType {
  updated_at: Date;
  name: string;
  inserted_at: Date;
  id: string;
  fields: Fields;
  description: string;
}

export interface Fields {
  position: string;
  name: string;
  joining_date: string;
  approved_by: string;
}

export interface Creator {
  updated_at: Date;
  name: string;
  inserted_at: Date;
  id: string;
  email_verify: boolean;
  email: string;
}

export interface State {
  updated_at: Date;
  state: string;
  order: number;
  inserted_at: Date;
  id: string;
}

// Generated by https://quicktype.io

export interface IBuild {
  updated_at: string;
  serialized: Serialized;
  raw: string;
  instance_id: string;
  inserted_at: string;
  id: string;
  build: string;
}

export interface Serialized {
  title: string;
  serialized: any;
  body: string;
}

// interface IBuildData {
//   build_id?:string;
//   instance_id?: string;
//   inserted_at?: string;
//   id?: string;
//   build?: string;
// }

export const TimeAgo = (time: any) => {
  const timetime = parseISO(time.time);
  const timed = formatDistanceToNow(timetime, { addSuffix: true });
  const timedAgo = format(timetime, 'PPpp');
  return (
    <Text
      pl={0}
      pt={1}
      sx={{
        fontSize: 0,
        '.hov': { opacity: 0 },
        ':hover': { '.hov': { opacity: 1 } },
      }}
      color="gray.6">
      {timed} -{' '}
      <Box as="span" className="hov">
        {timedAgo}
      </Box>
    </Text>
  );
};

const Form = () => {
  const token = useStoreState(state => state.auth.token);

  const router = useRouter();
  const cId: string = router.query.id as string;
  const [contents, setContents] = useState<ContentInstance>();
  const [loading, setLoading] = useState<boolean>(true);
  const [contentBody, setContentBody] = useState<any>();
  const [build, setBuild] = useState<IBuild>();

  const loadDataSucces = (data: any) => {
    setLoading(false);
    const res: ContentInstance = data;
    setContents(res);
  };

  const loadData = (t: string, id: string) => {
    loadEntity(t, `contents/${id}`, loadDataSucces);
  };

  /** DELETE content
   * @TODO move to inner page [design]
   */
  const delData = (id: string) => {
    if (token) {
      deleteEntity(`contents/${id}`, token);
    }
  };

  /**
   * On Build success
   * @param data
   */
  const onBuild = (data: any) => {
    setLoading(false);
    setBuild(data);
    if (token) {
      loadData(token, cId);
    }
  };

  /**
   * Pass for build
   */
  const doBuild = () => {
    console.log('Building');
    setLoading(true);
    createEntity([], `contents/${cId}/build`, token, onBuild);
  };

  useEffect(() => {
    if (token) {
      loadData(token, cId);
    }
  }, [token]);

  useEffect(() => {
    console.log('contentBody', contentBody);
  }, [contentBody]);

  useEffect(() => {
    if (contents && contents.content && contents.content.serialized) {
      const contentBodyAct = contents.content.serialized;

      if (contentBodyAct.serialized) {
        const contentBodyAct2 = JSON.parse(contentBodyAct.serialized);
        console.log('contentBodyAct2', contentBodyAct2);
        setContentBody(contentBodyAct2);
      }
    }
  }, [contents]);

  const doUpdate = () => {
    //
  };

  return (
    <Box py={3}>
      <Box sx={{ position: 'relative' }}>
        <Box></Box>
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              right: '-50%',
              left: '50%',
              top: '80px',
            }}>
            <Spinner width={40} height={40} color="primary" />
          </Box>
        )}
        {contents && contents.content && (
          <Flex>
            {/* { console.log('contents.content', contents.content.serialized.serialized)} */}
            <Box sx={{ width: '65%' }}>
              <Flex
                bg="white"
                sx={{
                  px: 4,
                  py: 4,
                  border: 'solid 1px',
                  borderColor: 'gray.3',
                }}>
                  <Box>
                <Text sx={{ fontSize: 3 }}>
                  {contents.content.serialized.title}
                </Text>
                {/* <Text
                  sx={{
                    fontSize: 0,
                    color: 'gray.6',
                  }}>{`Updated ${contents.content.inserted_at}`}</Text> */}
                <Box
                  sx={{
                    // pt: 1,
                    // pl: 2,
                    fontSize: 0,
                    color: 'gray.6',
                  }}>
                  <TimeAgo time={contents.content.inserted_at} />
                </Box>
                </Box>
                <Box
                  sx={{
                    pt: 1,
                    pl: 2,
                    fontSize: 0,
                    ml: 'auto',
                    color: 'gray.6',
                  }}>
                  <MenuItem
                    variant="rel"
                    href={`/content/edit/[id]`}
                    path={`content/edit/${contents.content.id}`}>
                    EDIT
                  </MenuItem>
                </Box>
              </Flex>
              <PreTag pt={0}>
                {contentBody && (
                  <MarkdownEditor
                    editable={false}
                    value={contentBody}
                    onUpdate={doUpdate}
                    initialValue={contentBody}
                    cleanInsert={true}
                    editor="wysiwyg"
                  />
                )}
                {/* <Text fontSize={1}>{contents.content.raw}</Text> */}
              </PreTag>
            </Box>
            <Box variant="plateSide" sx={{ pl: 4 }}>
              <Box>
                {build && (
                  <Box>
                    <Text>Updated At</Text>
                    <Text>{build.inserted_at}</Text>
                  </Box>
                )}
                <Box sx={{ pb: 2 }}></Box>
                {contents.content.build && (
                  <Flex pt={3}>
                    <File />
                    <Box>
                      <Box>
                        <Text sx={{ fontSize: 0, mb: 0, color: 'gray.6' }}>
                          {contents.state?.state}
                        </Text>
                        <Text sx={{ fontSize: 1, mb: 0, color: 'gray.8' }}>
                          {contents.content.instance_id}
                        </Text>
                        {/* <Text
                          sx={{ fontSize: 0, ml: 1, mt: 1, color: 'gray.6' }}
                          pt={0}>
                          v1.3
                        </Text> */}
                      </Box>
                    </Box>
                    <Link
                      variant="download"
                      href={`${API_HOST}/${contents.content.build}`}
                      target="_blank">
                      <Box
                        sx={{
                          p: 2,
                          pt: 1,
                          bg: 'green.8',
                          borderRadius: 4,
                          ml: 4,
                        }}>
                        <Download size={20} color="white" />
                      </Box>
                    </Link>
                  </Flex>
                )}
              </Box>
              <Flex
                sx={{
                  pt: 4,
                  alignItems: 'flex-start',
                  alignContent: 'flex-start',
                  flexDirection: 'row',
                }}>
                <Button variant="primary" onClick={() => doBuild()}>
                  <Flex>
                    {loading && <Spinner color="white" size={24} />}
                    {!loading && <Text>Build Now</Text>}
                  </Flex>
                </Button>
                <Button
                  sx={{ ml: 2 }}
                  variant="secondary"
                  onClick={() => delData(contents.content.id)}>
                  <Trash size={20} />
                </Button>
              </Flex>

              {contents && contents.content && (
                <Box mt={3}>
                  <Text>Comments</Text>
                  <CommentForm
                    master={contents.content_type.id}
                    master_id={contents.content.id}
                  />
                </Box>
              )}
            </Box>
          </Flex>
        )}
      </Box>
    </Box>
  );
};
export default Form;
