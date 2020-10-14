import React, { useEffect, useState } from 'react';
import { Box, Flex, Button, Text, Image } from 'theme-ui';
import { useForm } from 'react-hook-form';

import Field from './FieldText';
import { createEntity, loadEntity } from '../utils/models';
import { useStoreState } from 'easy-peasy';

// Generated by https://quicktype.io

export interface Comments {
  total_pages: number;
  total_entries: number;
  page_number: number;
  comments: Comment[];
}

export interface Comment {
  updated_at: string;
  parent_id: null;
  master_id: string;
  master: string;
  is_parent: boolean;
  inserted_at: string;
  id: string;
  comment: string;
  profile: Profile;
}

interface CommentFormProps {
  master: string;
  master_id: string;
}

export interface Profile {
  uuid: string;
  profile_pic: string;
  name: string;
  gender: string;
  dob: Date;
}

export interface User {
  updated_at: Date;
  name: string;
  inserted_at: Date;
  id: string;
  email_verify: boolean;
  email: string;
}

const CommentForm = (props: CommentFormProps) => {
  const { register, handleSubmit, errors } = useForm();
  const token = useStoreState(state => state.auth.token);

  const [comments, setComments] = useState<Array<Comment>>([]);

  const { master, master_id } = props;

  const onSubmit = (data: any) => {
    const commentExample = {
      master_id: master_id,
      master: master,
      is_parent: true,
      comment: data.body,
    };
    createEntity(commentExample, 'comments', token);
    loadEntity(token, `comments?master_id=${master_id}&page=0`, onLoadComments);
  };
  const onLoadComments = (data: any) => {
    if (data.comments) {
      setComments(data.comments);
    }
  };

  useEffect(() => {
    loadEntity(token, `comments?master_id=${master_id}&page=1`, onLoadComments);
  }, [master_id, token]);

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} py={3} mt={4}>
      {comments && comments.length > 0 && (
        <Box>
          {comments.map((comment: Comment) => (
            <Box
              // pb={2}
              // pt={2}
              mb={1}
              sx={{
                borderBottom: 'solid 1px',
                borderColor: 'gray.2',
                pb: 3,
                mb: 2,
              }}>
              <Flex sx={{ display: 'inline-flex' }}>
                <Box>
                  <Image
                    width={30}
                    height={30}
                    sx={{ borderRadius: 99 }}
                    src={`http://localhost:4000${comment?.profile?.profile_pic}`}
                  />
                </Box>
                <Box sx={{ pl: 3 }}>
                  <Flex>
                    <Text sx={{ pl: 0, fontSize: 0, pb: 0, fontWeight: 600, pt: 0 }}>
                      {comment?.profile?.name}
                    </Text>
                    <Text mt={1} color="#555" sx={{ fontSize: 0, ml: 2 }}>
                      8:30 PM
                      {/* {comment.inserted_at} */}
                    </Text>
                  </Flex>

                    <Text as="p" sx={{ mt: 0, fontSize: 0, m:0 }}>{comment.comment}</Text>
                </Box>
              </Flex>
            </Box>
          ))}
        </Box>
      )}
      <Box>
        <Text mb={3} mt={3}>
          Add Comment
        </Text>
      </Box>
      <Box mx={0} mb={0}>
        <Flex>
          <Box>
            <Field name="body" label="" defaultValue="" register={register} />
          </Box>
          {errors.body && <Text>This field is required</Text>}
        </Flex>
      </Box>
      <Button ml={0}>Add Comment</Button>
    </Box>
  );
};
export default CommentForm;
