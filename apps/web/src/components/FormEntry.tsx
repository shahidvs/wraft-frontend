import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Flex, Input, Label, Spinner, Text, Textarea } from 'theme-ui';
import { Button } from '@wraft/ui';
import toast from 'react-hot-toast';

import { Logo } from 'components/Icons';
import { fetchAPI, postAPI } from 'utils/models';

const FormEntry = ({ formId, setIsOpen }: any) => {
  const [items, setItems] = useState<any>([]);
  const [initial, setInitial] = useState<any>([]);
  const [formdata, setFormdata] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const cId: string = router.query.id as string;
  const loadData = (id: string) => {
    setLoading(true);
    fetchAPI(`forms/${id}`)
      .then((data: any) => {
        setFormdata(data);
        const fields = data.fields.map((i: any) => {
          return {
            id: i.id,
            name: i.name,
            type: i.field_type.name,
            fieldTypeId: i.field_type.id,
            required: i.validations.some(
              (val: any) =>
                val.validation.rule === 'required' &&
                val.validation.value === true,
            ),
            value: '',
          };
        });
        setInitial(fields);
        setItems(fields);
        setLoading(false);
      })
      .catch((_err) => {
        setLoading(false);
      });
  };

  const onClear = () => {
    setItems(initial);
  };

  const onValueChange = (e: any, item: any) => {
    const newVal = e.target.value;
    const newItem = {
      ...item,
      value: newVal,
      error:
        newVal.length === 0 && item.required
          ? 'This field is required'
          : undefined,
    };
    const newArr = items.map((s: any) => {
      if (s.id === item.id) {
        return newItem;
      } else {
        return s;
      }
    });
    setItems(newArr);
  };

  const onSave = () => {
    console.log('logvannu');

    if (items.some((i: any) => i.value.length === 0 && i.required)) {
      const errorsAdded = items.map((i: any) => {
        if (i.value.length === 0 && i.required === true) {
          return { ...i, error: 'This field is required' };
        } else {
          console.log(i, 'loggi');

          return i;
        }
      });
      console.log(errorsAdded, 'logg');

      setItems(errorsAdded);
      return;
    }
    const fields = items.map((i: any) => {
      return {
        value: i.value,
        field_id: i.id,
      };
    });
    const data = {
      data: fields,
    };

    const cID = formId ? formId : cId;

    postAPI(`forms/${cID}/entries`, data)
      .then(() => {
        toast.success('Submitted Successfully');
        setIsOpen(false);
        onClear();
      })
      .catch((err) => {
        if (err.errors == 'No mappings found')
          toast.error('Pipeline configuration incompleted');
      });
  };

  useEffect(() => {
    if (cId && cId.length > 0) loadData(cId);
  }, [cId]);

  useEffect(() => {
    if (formId) loadData(formId);
  }, [formId]);

  useEffect(() => {
    console.table(items);
  }, [items]);

  if (loading) {
    return (
      <Flex
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}>
        <Spinner width={32} />
      </Flex>
    );
  }

  return (
    <Box sx={{ background: 'background' }}>
      <Box sx={{ position: 'absolute', top: 4, left: 4 }}>
        <Logo />
      </Box>
      <Flex
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Box
          sx={{
            my: 5,
            maxWidth: '80ch',
            width: '100%',
          }}>
          <Box sx={{ width: '100%', height: '4px', bg: 'green.700' }}></Box>
          <Box
            sx={{
              bg: 'white',
              p: 4,
              border: '1px solid',
              borderTop: 'none',
              borderColor: 'border',
            }}>
            <Text as="p" variant="h4Medium">
              {formdata?.name || 'name'}
            </Text>
            <Text as="p" variant="h6Regular" sx={{ mt: 3, color: 'gray.600' }}>
              {formdata?.description || 'description'}
            </Text>
          </Box>
          <Box
            sx={{
              mt: 4,
              bg: 'white',
              border: '1px solid',
              borderColor: 'border',
            }}>
            {items.map((item: any) => (
              <Box
                key={item.id}
                sx={{
                  p: 4,
                  borderBottom: '1px solid',
                  borderColor: 'border',
                }}>
                <Label>
                  {item.name}
                  <Text sx={{ color: 'red.700' }}>{item.required && '*'}</Text>
                </Label>
                {item.type === 'Text' && (
                  <Textarea
                    value={item.value}
                    onChange={(e) => onValueChange(e, item)}
                  />
                )}
                {item.type === 'String' && (
                  <Input
                    value={item.value}
                    onChange={(e) => onValueChange(e, item)}
                  />
                )}
                {item.type === 'File Input' && (
                  <Input
                    type="file"
                    value={item.value}
                    onChange={(e) => onValueChange(e, item)}
                  />
                )}
                {item.type === 'Date' && (
                  <Input
                    type="date"
                    value={item.value}
                    onChange={(e) => onValueChange(e, item)}
                  />
                )}
                {item.error && <Text variant="error">{item.error}</Text>}
              </Box>
            ))}
          </Box>
          <Flex sx={{ p: 4, pl: 0, gap: '16px' }}>
            <Button onClick={onSave}>Save</Button>
            <Button variant="secondary" onClick={onClear}>
              Clear
            </Button>
          </Flex>
          <Text as="p" variant="pR" mt={4}>
            This content is created by the owner of the form. The data you
            submit will be sent to the form owner. Wraft is not responsible for
            the privacy or security practices of its customers, including those
            of this form owner. Never give out your password.
          </Text>
          <Text as="p" variant="pR" mt={4}>
            Powered by <Text variant="pB">Wraft Forms</Text>
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default FormEntry;
