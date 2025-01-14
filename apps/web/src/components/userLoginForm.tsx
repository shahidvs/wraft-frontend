import { useEffect, useState } from 'react';
import Image from 'next/image';
import Router from 'next/router';
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@wraft/ui';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Heading } from 'theme-ui';
import { Box, Flex, Text } from 'theme-ui';
import { z } from 'zod';

import { BrandLogo } from 'components/Icons';
import Field from 'common/Field';
import Link from 'common/NavLink';
import { useAuth } from 'contexts/AuthContext';
import { userLogin } from 'utils/models';
import { emailPattern } from 'utils/zodPatterns';

import GoogleLogo from '../../public/GoogleLogo.svg';

export interface IField {
  name: string;
  value: string;
}

type FormValues = {
  email: string;
  password: string;
};

const schema = z.object({
  email: emailPattern,
  password: z.string().min(1, { message: 'Please enter a valid password.' }),
});

const UserLoginForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const { login, accessToken } = useAuth();
  const { data, status } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const router = useRouter();
  const homePageUrl = process.env.homePageUrl || '/';
  const isSelfHost =
    process.env.SELF_HOST?.toLowerCase() === 'false' ? false : true;

  const { session, error } = router.query;

  useEffect(() => {
    const handleSignOut = async () => {
      if (session) {
        try {
          if (status === 'authenticated') {
            await signOut({ redirect: false });
          }
          router.push('/login');
        } catch (err) {
          console.error('Error during sign out:', err);
        }
      }
    };

    handleSignOut();
  }, [session]);

  useEffect(() => {
    if (error) {
      toast.error((error as string) || 'somthing wrong', {
        duration: 3000,
        position: 'top-right',
      });
      router.push('/login');
    }
  }, [error]);

  useEffect(() => {
    if (status === 'authenticated' && data?.user && !session) {
      login(data?.user);
    }
  }, [data, status]);

  const onSubmit = async (formData: any): Promise<void> => {
    setLoading(true);
    setLoginError(null);
    try {
      const res = await userLogin(formData);
      if (res) {
        login(res);
      }
      setLoading(false);
    } catch (err) {
      console.error('Login error: vb', err);
      setLoginError(err?.errors || 'something wrong');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      Router.push('/');
    }
  }, [accessToken]);

  return (
    <Flex variant="onboardingFormPage">
      <Box sx={{ position: 'absolute', top: '80px', left: '80px' }}>
        <Link href={homePageUrl}>
          <Box sx={{ color: `gray.0`, fill: 'gray.1200' }}>
            <BrandLogo width="7rem" height="3rem" />
          </Box>
        </Link>
      </Box>
      <Flex variant="onboardingForms" sx={{ justifySelf: 'center' }}>
        <Heading
          as="h3"
          variant="styles.h3Medium"
          sx={{ fontSize: '2xl', mb: '48px', color: 'gray.1200' }}>
          Sign in
        </Heading>

        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
          <Field
            name="email"
            label="Email"
            register={register}
            type={'email'}
            error={errors.email}
            mb={3}
          />
          <Field
            name="password"
            label="Password"
            register={register}
            type="password"
            error={errors.password}
            mb={3}
          />
          <Flex>
            <Box>
              <Button
                type="submit"
                variant="primary"
                // sx={{ fontSize: 3 }}
                loading={loading}>
                Sign in
              </Button>
            </Box>
            <Flex
              sx={{
                ml: 'auto',
                alignItems: 'center',
                mb: '28px',
                justifyContent: 'space-between',
              }}>
              {loginError && <Text variant="error">{loginError}</Text>}
              <Box />
              <Link href="/resetpassword">
                <Text
                  variant="pM"
                  sx={{
                    cursor: 'pointer',
                    color: 'gray.800',
                  }}>
                  Forgot Password?
                </Text>
              </Link>
            </Flex>
          </Flex>
        </Box>

        {((process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_CLIENT_ID) ||
          !isSelfHost) && (
          <>
            <Box
              sx={{
                borderBottom: '1px solid',
                borderColor: 'border',
                whidth: '100%',
                mt: '63px',
                mb: '56px',
              }}
            />

            {process.env.GOOGLE_CLIENT_SECRET &&
              process.env.GOOGLE_CLIENT_ID && (
                <Button onClick={() => signIn('gmail')} variant="googleLogin">
                  <Flex
                    sx={{
                      alignItems: 'center',
                      gap: 2,
                      minWidth: '100%',
                      bg: 'none',
                      border: 'none',
                      color: 'gray.900',
                    }}
                    variant="buttons.googleLogin">
                    <Image src={GoogleLogo} alt="" width={24} height={24} />
                    Login in with Google
                  </Flex>
                </Button>
              )}

            {!isSelfHost && (
              <Flex
                sx={{
                  alignItems: 'center',
                  mt: '24px',
                  color: 'gray.1000',
                  gap: '8px',
                  mb: '48px',
                }}>
                <Text variant="pR">Not a user yet? {''}</Text>
                <Link href="/signup" variant="none">
                  <Text variant="pB" sx={{ cursor: 'pointer' }}>
                    Request invite
                  </Text>
                </Link>
              </Flex>
            )}
          </>
        )}
      </Flex>
    </Flex>
  );
};
export default UserLoginForm;
