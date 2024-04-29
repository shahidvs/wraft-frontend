import React, { useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router';
import {
  Box,
  Flex,
  Text,
  Button,
  Container,
  Label,
  Select,
  Field,
} from 'theme-ui';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { deleteAPI, fetchAPI } from 'utils/models';

import PageHeader from './PageHeader';
import PipelineSteps from './PipelineSteps';
import MenuStepsIndicator from './MenuStepsIndicator';
import Modal from './Modal';
import { ConfirmDelete } from './common';
import PipelineLogs from './PipelineLogs';

const PipelineView = () => {
  const {
    register,
    control,
    formState: { errors },
    setValue,
  } = useForm<any>();
  const [rerender, setRerender] = useState<boolean>(false);
  const [formStep, setFormStep] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [pipelineData, setPipelineData] = useState<any>([]);

  const router = useRouter();

  const cId: string = router.query.id as string;

  const goTo = (step: number) => {
    setFormStep(step);
  };

  const loadDetails = () => {
    fetchAPI(`pipelines/${cId}`).then((data: any) => {
      setPipelineData(data);
    });
  };

  useEffect(() => {
    loadDetails();
  }, [cId]);

  const onDelete = () => {
    deleteAPI(`pipelines/${cId}`)
      .then(() => {
        setRerender && setRerender((prev: boolean) => !prev);
        toast.success('Deleted Successfully', { duration: 1000 });
        Router.push('/manage/pipelines');
      })
      .catch(() => {
        toast.error('Delete Failed', { duration: 1000 });
      });
  };

  const titles = ['Steps', 'Configure', 'History', 'Logs'];

  return (
    <Box>
      <PageHeader title="Pipelines">
        <Flex mt={'auto'} sx={{ justifyContent: 'space-between' }}>
          <Flex>
            <Button variant="buttonSecondary" type="button">
              Run
            </Button>
            <Button ml={2} variant="buttonPrimary" type="button">
              Save
            </Button>
          </Flex>
        </Flex>
      </PageHeader>
      <Container variant="layout.pageFrame">
        <Flex>
          <MenuStepsIndicator titles={titles} formStep={formStep} goTo={goTo} />
          <Box sx={{ width: '100%' }}>
            <Box
              sx={{
                display: formStep === 0 ? 'block' : 'none',
              }}>
              <PipelineSteps rerender={rerender} setRerender={setRerender} />
            </Box>
            <Box
              sx={{
                display: formStep === 1 ? 'block' : 'none',
                width: '60ch',
              }}>
              <Flex
                sx={{
                  flexDirection: 'column',
                  gap: '28px',
                }}>
                <Box>
                  <Field
                    name="name"
                    label="Name"
                    disabled
                    defaultValue={pipelineData.name}
                  />
                </Box>
                <Box>
                  <Label htmlFor="slug">Source</Label>
                  <Controller
                    control={control}
                    name="slug"
                    defaultValue="contract"
                    rules={{ required: 'Please select a slug' }}
                    render={({ field }) => (
                      <Select mb={0} {...field} disabled>
                        <option>ERPNext</option>
                        <option>CSV</option>
                      </Select>
                    )}
                  />
                </Box>

                <Box sx={{ alignItems: 'center' }}>
                  <Text variant="pM" mr={2}>
                    Remove Pipeline
                  </Text>
                  <Box mt={3}>
                    <Button
                      variant="delete"
                      onClick={() => {
                        setIsOpen(true);
                      }}>
                      Remove
                    </Button>
                  </Box>
                </Box>
              </Flex>
            </Box>
            <Box
              sx={{
                display: formStep === 3 ? 'block' : 'none',
              }}>
              <PipelineLogs rerender={rerender} setRerender={setRerender} />
            </Box>
          </Box>
        </Flex>
      </Container>
      <Modal isOpen={isOpen}>
        {
          <ConfirmDelete
            title="Delete Pipeline"
            text="Are you sure you want to delete ?"
            setOpen={setIsOpen}
            onConfirmDelete={() => {
              onDelete();
              setIsOpen(false);
            }}
          />
        }
      </Modal>
    </Box>
  );
};
export default PipelineView;
