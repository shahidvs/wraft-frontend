import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, Text } from 'theme-ui';

import { fetchAPI, postAPI } from '../utils/models';
import CommentCard from './CommentCard';
import Field from './FieldText';

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
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [submiting, setSubmitting] = useState<boolean>(false);

  const [comments, setComments] = useState<Array<Comment>>([]);

  const { master, master_id } = props;

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    const commentExample = {
      master_id: master_id,
      master: master,
      is_parent: true,
      comment: data.body,
    };

    try {
      await postAPI('comments', commentExample);
      fetchAPI(`comments?master_id=${master_id}&page=0`).then((data: any) => {
        if (data.comments) {
          setComments(data.comments);
          setSubmitting(false);
          setValue('body', '');
        }
      });
    } catch {
      console.error('comment error');
    }
  };

  useEffect(() => {
    fetchAPI(`comments?master_id=${master_id}&page=1`).then((data: any) => {
      if (data.comments) {
        setComments(data.comments);
      }
    });
  }, [master_id]);

  return (
    <>
      {comments && comments.length > 0 && (
        <Box>
          {comments.map((comment: Comment) => (
            <CommentCard key={comment.id} {...comment} />
          ))}
        </Box>
      )}
      <Box as="form" onSubmit={handleSubmit(onSubmit)} py={0} mt={0}>
        <Box mx={0} mb={0}>
          <Field name="body" label="" defaultValue="" register={register} />
          {errors.body && <Text>This field is required</Text>}
        </Box>
        <Button variant="btnSecondary" ml={0} sx={{ mt: 0, fontSize: 1 }}>
          {submiting ? 'Saving ... ' : 'Add Comment'}
        </Button>
      </Box>
    </>
  );
};
export default CommentForm;