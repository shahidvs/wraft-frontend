import React, { useEffect } from 'react';
import { Box, Flex, Text } from 'rebass';
import styled from 'styled-components';
import cookie from 'js-cookie';

import { useStoreState, useStoreActions } from 'easy-peasy';

// relative
import Link from './NavLink';
import { UserIcon } from './Icons';
import { checkUser } from '../utils/models';

const Header = styled(Box)`
  border-bottom: solid 1px #eee;
  padding-bottom: 12px;
  padding-top: 12px;
  padding-left: 12px;
  padding-left: 24px;
  border-bottom: solid 1px #eee;
`;

export interface IUser {
  name: string;
}

const Nav = () => {
  // const [user, setUser] = useState<IUser>();
  const setToken = useStoreActions((actions: any) => actions.auth.addToken);
  const setProfile = useStoreActions(
    (actions: any) => actions.profile.updateProfile,
  );
  const userLogout = useStoreActions((actions: any) => actions.auth.logout);
  const token = useStoreState(state => state.auth.token);
  const profile = useStoreState(state => state.profile.profile);

  const onProfileLoad = (data: any) => {
    setProfile(data);
    
    if(data === 'x') {
      setProfile(data);
      // setUser(data);
    }    
  };

  useEffect(() => {
    // check if token is there
    const t = cookie.get('token') || false;
    // login to check
    if (t){
      // if(t === '') {
      //   checkUser(t, onProfileLoad)        
      // }
      checkUser(t, onProfileLoad)
      setToken(t);
    }
    // check if cooke token is present
    // if so set it as state, and then call the user object
  }, []);

  return (
    <Header>
      <Flex py={2} px={1} pl={0} pr={3}>
        
        <Link href="/">
          {/* <Logo /> */}
        </Link>
        
        <Box ml="auto" mr={3}>
          <Flex>
            {!token && (
              <Link href="/login">
                <Text>Login</Text>
              </Link>
            )}
            {token && token !== '' && (
              <Flex ml={2}>                
                {profile && (
                  <Text fontSize={1} ml={2} pt={2} mr={3} fontWeight="bold">
                    {profile.name}
                  </Text>
                )}                
                <UserIcon/>
                <Text onClick={userLogout}>Logout</Text>
              </Flex>
            )}
          </Flex>
        </Box>
      </Flex>
    </Header>
  );
};
export default Nav;
