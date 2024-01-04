import React, { FC, useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import {
  Flex,
  Container,
  Button,
  Box,
  Input,
  Label,
  Text,
  Image,
  Checkbox,
} from 'theme-ui';
import { useForm } from 'react-hook-form';
import {
  updateEntityFile,
  deleteEntity,
  createEntity,
  fetchAPI,
} from '../../../utils/models';
import Router from 'next/router';

import toast from 'react-hot-toast';

import Page from '../../../components/PageFrame';
import PageHeader from '../../../components/PageHeader';
import ManageSidebar from '../../../components/ManageSidebar';
import { workspaceLinks } from '../../../utils';
import ModalCustom from '../../../components/ModalCustom';
import Field from '../../../components/Field';
import { ConfirmDelete } from '../../../components/common';
import { useAuth } from '../../../contexts/AuthContext';

export interface Organisation {
  id: string;
  name: string;
  address: string;
  url: string;
  logo: string;
  email: string;
  phone: string;
  corporate_id: string;
  gstin: string;
  legal_name: string;
  name_of_ceo: string;
  name_of_cto: string;
}

type FormInputs = {
  // logo: FileList;
  logo: any;
  name: string;
  url: string;
};

const Index: FC = () => {
  const { register, handleSubmit } = useForm<FormInputs>({ mode: 'all' });
  const [isDelete, setDelete] = useState(false);
  const [isConfirmDelete, setConfirmDelete] = useState(false);
  const [org, setOrg] = useState<Organisation>();
  const [logoSrc, setLogoSrc] = useState(org?.logo);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [inputValue, setInputValue] = useState<number>(0);

  const { userProfile, accessToken, logout } = useAuth();

  const orgId = userProfile?.organisation_id || null;
  const currentOrg = userProfile?.currentOrganisation || null;

  console.log('userProfile', userProfile);

  const onUpdate = (data: any) => {
    console.log(data);
  };

  useEffect(() => {
    if (orgId) {
      fetchAPI(`organisations/${orgId}`).then((data: any) => {
        setOrg(data);
      });
    }
  }, [orgId]);

  const backupLogo =
    'https://imagedelivery.net/5MYSbk45M80qAwecrlKzdQ/2dab3411-8db4-4673-6e4b-f3a9aa5b0900/preview';

  useEffect(() => {
    const logo = org?.logo || backupLogo;
    setLogoSrc(logo);
  }, [org]);

  const onSubmit = (data: any) => {
    const formData = new FormData();
    if (data.logo && data.logo.length > 0) {
      formData.append('logo', data.logo[0]);
    }
    if (data.name !== 'Personal' && data.name !== '') {
      formData.append('name', data.name);
    }
    if (data.url !== '') {
      formData.append('url', data.url);
    }

    if (orgId) {
      updateEntityFile(
        `organisations/${orgId}`,
        formData,
        accessToken as string,
        onUpdate,
      );

      toast.success(`Updated Workspace ${data.name}`, {
        duration: 1000,
        position: 'top-right',
      });
    }
  };

  useEffect(() => {
    const data = inputRef.current?.value;
    setInputValue(parseInt(data ?? '0', 10));
  }, [inputRef.current?.value]);

  const onConfirmDelete = async (inputValue: any) => {
    deleteEntity(
      `/organisations`,
      accessToken as string,
      () => {
        toast.success(`Deleted workspace successfully`, {
          duration: 1000,
          position: 'top-right',
        });
      },
      (error: any) => {
        toast.success(error?.message || 'failed', {
          duration: 1000,
          position: 'top-right',
        });
      },
      { code: `${inputValue}` },
    );

    setConfirmDelete(false);
    logout();
    Router.push('/login');
  };

  const [previewSource, setPreviewSource] = React.useState<
    string | undefined | null
  >(undefined);
  const handleImageUpload = (event: any) => {
    const file = event.target.files[0];
    previewFile(file);
  };
  const previewFile = (file: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      if (reader !== null) {
        setPreviewSource(reader.result as string | null | undefined);
      }
    };
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <>
      <Head>
        <title>Workspace | Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <PageHeader title="Workspace management" desc="Manage  >  Workspace">
          <div></div>
        </PageHeader>
        <Container
          sx={{
            px: 4,
            pt: 0,
            maxHeight: '90vh',
            overflow: 'auto',
            bg: 'background',
          }}>
          <Flex>
            {(currentOrg?.name !== 'Personal' || '') && (
              <ManageSidebar items={workspaceLinks} />
            )}
            <Box>
              <Box
                as="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{
                  minWidth: '556px',
                  bg: 'bgWhite',
                  border: '1px solid',
                  borderColor: 'neutral.1',
                  borderRadius: 4,
                  p: 4,
                  m: 4,
                }}>
                <Image
                  variant="profile"
                  src={previewSource ? previewSource : logoSrc}
                  alt="logo"
                  onError={() => setLogoSrc(backupLogo)}
                  onClick={() => fileRef.current?.click()}
                  sx={{ mb: 4 }}
                />
                <Input
                  sx={{ display: 'none' }}
                  type="file"
                  {...register('logo')}
                  accept=".jpg,.jepg,.png,.gif"
                  ref={fileRef}
                  onChange={handleImageUpload}
                />
                <Field
                  label="Workspace name"
                  placeholder="Personal"
                  defaultValue={org?.name}
                  name="name"
                  register={register}
                  disable={org?.name === 'Personal'}
                />
                <Field
                  label="Workspace URL"
                  placeholder={'wraft.co/example'}
                  defaultValue={org?.url}
                  name="url"
                  register={register}
                />
                <Button variant="btnPrimary" sx={{ mt: '18px' }} type="submit">
                  Update
                </Button>
              </Box>
              {(currentOrg?.name !== 'Personal' || '') && (
                <Box
                  sx={{
                    bg: 'bgWhite',
                    border: '1px solid',
                    borderColor: 'neutral.1',
                    borderRadius: 4,
                    p: 4,
                    m: 4,
                  }}>
                  <Text variant="pR" sx={{ display: 'inline-block', mb: 2 }}>
                    Delete workspace
                  </Text>
                  <br />
                  <Text
                    variant="pM"
                    sx={{ display: 'inline-block', mb: '18px' }}>
                    This workspace will be permanently removed from Wraft
                  </Text>
                  <br />
                  <Button
                    onClick={() => {
                      setDelete(true);
                      createEntity(
                        {},
                        '/organisations/request_deletion',
                        accessToken as string,
                        (data: any) => {
                          toast.success(data.info, {
                            duration: 1000,
                            position: 'top-right',
                          });
                        },
                        (error: any) => {
                          toast.success(error, {
                            duration: 1000,
                            position: 'top-right',
                          });
                        },
                      );
                    }}
                    type="button"
                    variant="delete"
                    sx={{
                      borderRadius: 6,
                      fontSize: 2,
                      fontWeight: 'heading',
                    }}>
                    Delete Workspace
                  </Button>
                  <ModalCustom isOpen={isDelete} setOpen={setDelete}>
                    <Text
                      variant="pB"
                      sx={{
                        py: 3,
                        px: 4,
                        display: 'inline-block',
                      }}>
                      Verify workspace delete request
                    </Text>
                    <Box
                      sx={{
                        pt: 3,
                        pb: 4,
                        borderTop: '1px solid',
                        borderColor: 'neutral.1',
                      }}>
                      <Box sx={{ px: 4 }}>
                        <Text
                          variant="pR"
                          sx={{ textWrap: 'balance', display: 'inline-block' }}>
                          If you are sure you want to proceed with deletion of
                          the workspace{' '}
                          <Text as={'span'} variant="pB">
                            Functionary
                          </Text>
                          , please enter the deletion code sent to your email.
                        </Text>
                        <Box sx={{ mt: '24px' }}>
                          <Label variant="text.pR" sx={{ color: 'gray.8' }}>
                            {/* Enter the deletion code */}
                            <span>Enter the deletion code to confirm</span>
                          </Label>
                          <Input ref={inputRef}></Input>
                        </Box>
                        <Label
                          sx={{
                            mt: '18px',
                            display: 'flex',
                            alignItems: 'center',
                          }}>
                          <Checkbox
                            checked={isChecked}
                            onChange={handleCheckboxChange}
                          />
                          <Text variant="subM">
                            I acknowledge I understand that all of the data will
                            be deleted and want to proceed
                          </Text>
                        </Label>
                        <Flex sx={{ gap: 3, pt: 4 }}>
                          <Button
                            disabled={!isChecked}
                            onClick={() => {
                              setDelete(false);
                              setConfirmDelete(true);
                            }}
                            variant="delete">
                            Delete workspace
                          </Button>
                          <Button
                            onClick={() => setDelete(false)}
                            variant="cancel">
                            Cancel
                          </Button>
                        </Flex>
                      </Box>
                    </Box>
                  </ModalCustom>
                  <ModalCustom
                    isOpen={isConfirmDelete}
                    setOpen={setConfirmDelete}>
                    <ConfirmDelete
                      inputValue={inputValue}
                      title="Delete workspace"
                      text="Are you sure you want to delete this workspace?"
                      onConfirmDelete={onConfirmDelete}
                      setOpen={setConfirmDelete}
                    />
                  </ModalCustom>
                </Box>
              )}
            </Box>
          </Flex>
        </Container>
      </Page>
    </>
  );
};

export default Index;
