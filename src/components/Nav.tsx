import React, { useEffect, useState } from 'react';
import { Box, Flex, Image, Text, Input } from 'theme-ui';
import cookie from 'js-cookie';

import { useStoreState, useStoreActions } from 'easy-peasy';
import { useHotkeys } from 'react-hotkeys-hook';
// relative

import { API_HOST, checkUser } from '../utils/models';
import { Bell, Search } from '@styled-icons/boxicons-regular';
import { Plus as Add } from '@styled-icons/boxicons-regular/Plus';

import { useMenuState, Menu, MenuItem, MenuButton } from 'reakit/Menu';
import { Clickable } from 'reakit/Clickable';

import Blok from './Blok';
import Link from './NavLink';
import Modal from './Modal';

/**
 * Reakit Button
 */

interface ButtonLinkProps {
  onToggleSearch?: any;
}

const ButtonLink = ({ onToggleSearch }: ButtonLinkProps) => {
  return (
    <Clickable
      as={Box}
      onClick={() => onToggleSearch()}
      sx={{
        // pt: 0,
        // bg: 'gray.2',
        fontSize: 1,
        color: '#111',
        border: 'solid 1px',
        verticleAlign: 'top',
        borderColor: 'gray.4',
        // bg: 'green.8',
        borderRight: 0,
        width: '8ch',
        pl: 2,
        pt: 1,
        // mr: 2,
        // px: 2,
        // py: 1,
        // mb: 2,
        borderRadius: '4px 0 0 4px',
        '&:hover': {
          bg: 'gray.8',
          color: 'gray.0',
          border: 'solid 1px',
          borderColor: 'gray.2',
          cursor: 'pointer',
          svg: {
            fill: 'gray.0',
          },
        },
        svg: {
          fill: 'gray.8',
        },
        // borderRadius: 4,
      }}
    >
      {/* <Search width="16px" /> */}

      <Text
        sx={{
          display: 'display-inline',
          ml: 1,
          fontWeight: 900,
          letterSpacing: '-0.15px',
          fontSize: '14px',
        }}
      >
        <Add width={18} />
        <Text sx={{ ml: 1, pt: 1, fontSize: '14px' }}>New</Text>
      </Text>
    </Clickable>
  );
};

export interface IUser {
  name: string;
}

interface INav {
  navtitle?: string;
}

const Nav = ({ navtitle }: INav) => {
  // const [user, setUser] = useState<IUser>();
  const setToken = useStoreActions((actions: any) => actions.auth.addToken);
  const setProfile = useStoreActions(
    (actions: any) => actions.profile.updateProfile,
  );
  const userLogout = useStoreActions((actions: any) => actions.auth.logout);
  const token = useStoreState((state) => state.auth.token);
  const profile = useStoreState((state) => state.profile.profile);

  const [showSearch, setShowSearch] = useState<boolean>(false);

  const menu = useMenuState();

  const onProfileLoad = (data: any) => {
    setProfile(data);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  const closeSearch = () => {
    setShowSearch(false);
  };

  useEffect(() => {
    // check if token is there
    const t = cookie.get('token') || false;
    // login to check
    if (t) {
      checkUser(t, onProfileLoad);
      setToken(t);
    }
  }, []);

  useHotkeys('/', () => {
    toggleSearch();
  });

  return (
    <Box
      variant="header"
      // onClick={() =>closeSearch}
      sx={{
        p: 0,
        bg: 'gray.0',
        borderBottom: 'solid 1px',
        borderColor: 'gray.3',
        pt: 0,
        pb: 2,
      }}
    >
      <Flex sx={{ pt: 2 }}>
        <Box
          sx={{
            flexBasis: ['auto', 200],
            order: -1,
          }}
        >
          <Box
            sx={{
              p: 0,
              pt: 1,
              pl: 3,
              borderRight: 'solid 1px',
              borderColor: 'gray.0',
              color: 'gray.8',
              pb: 1,
            }}
          >
            <Flex sx={{ minWidth: '80ch' }}>
              {/* <Button variant="btnPrimaryIcon" sx={{ fontSize: 0, fontWeight: 600, pt: 1 }} onClick={() => toggleSearch()}>New</Button> */}
              {/* <Link href="/contents">
                <Box color="gray.8" sx={{ ml: 3, mt: 2, fill: 'text' }}>
                  <Search width="20px" />
                </Box>
              </Link> */}
              {/* <Box>
                <Text as="h4">NDA between Bijoy and Functionary Labs Pvt Ltd</Text>
              </Box> */}

              <Flex variant="button" sx={{ mt: 0, pt: 0, ml: 3 }}>
                <ButtonLink onToggleSearch={toggleSearch} />
                <Flex
                  sx={{
                    position: 'relative',
                    height: '40px',
                    width: '80ch',
                    border: 'solid 1px #ddd',
                    borderRadius: '4px',
                  }}
                >
                  <Input
                    variant="small"
                    placeholder="Search for docs"
                    sx={{
                      borderRadius: 0,
                      width: '130% !important',
                      fontSize: 1,
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      pl: 2,
                      right: 1,
                      top: 0,
                      pt: 1,
                      bottom: 0,
                      borderLeft: 'solid 1px',
                      borderColor: 'gray.3',
                      svg: {
                        fill: 'gray.8',
                        pr: 2,
                      },
                    }}
                  >
                    <Search
                      sx={{
                        borderLeft: 'solid 1px',
                        borderColor: 'gray.4',
                      }}
                      width={28}
                    />
                  </Box>
                </Flex>
              </Flex>
            </Flex>
          </Box>
        </Box>
        <Box ml="auto" mr={3}>
          {navtitle && <Text variant="navtitle">{navtitle}</Text>}
          <Flex sx={{ bg: 'gray.0' }}>
            <Flex sx={{ bg: 'gray.0', ':hover': { bg: 'gray.1' } }}>
              <Box as="span" sx={{ mt: 2 }}></Box>

              <Box
                variant="button"
                sx={{ mt: 1, pt: 1, px: 3, svg: { fill: 'gray.6' } }}
              >
                <Link href="/activities">
                  <Bell width="20px" />
                </Link>
              </Box>
            </Flex>
            {!token && (
              <Link href="/login">
                <Text>Login</Text>
              </Link>
            )}
            {token && token !== '' && (
              <Flex ml={1}>
                {profile && (
                  <Flex
                    sx={{
                      alignContent: 'top',
                      verticalAlign: 'top',
                      mt: 2,
                    }}
                  >
                    <Box>
                      <MenuButton as={Box} {...menu}>
                        <Image
                          sx={{ borderRadius: '3rem' }}
                          width="30px"
                          src={API_HOST + '/' + profile?.profile_pic}
                        />
                      </MenuButton>
                      <Menu
                        as={Box}
                        // sx={{ border: 'solid 1px #eee' }}
                        {...menu}
                        sx={{ border: 'solid 1px #eee', minWidth: '20ch' }}
                        aria-label="Preferences"
                      >
                        <MenuItem
                          as={Box}
                          sx={{
                            p: 3,
                            py: 2,
                            bg: 'gray.0',
                            borderBottom: 'solid 1px #eee',
                            '&:hover': {
                              bg: 'gray.1',
                            },
                          }}
                          {...menu}
                        >
                          <Box>
                            <Text as="h4">{profile?.name}</Text>

                            {profile?.roles?.size > 0 && (
                              <Text
                                as="p"
                                sx={{ fontSize: 0, color: 'gray.6' }}
                              >
                                {profile?.roles[0]?.name}
                              </Text>
                            )}
                          </Box>
                        </MenuItem>
                        <MenuItem
                          as={Box}
                          sx={{
                            p: 3,
                            py: 2,
                            bg: 'gray.0',
                            borderBottom: 'solid 1px #eee',
                            '&:hover': {
                              bg: 'gray.1',
                            },
                          }}
                          {...menu}
                        >
                          Settings
                        </MenuItem>
                        <MenuItem
                          as={Box}
                          sx={{
                            p: 3,
                            py: 2,
                            bg: 'gray.0',
                            borderBottom: 'solid 1px #eee',
                            '&:hover': {
                              bg: 'gray.1',
                            },
                          }}
                          {...menu}
                        >
                          Profile
                        </MenuItem>
                        <MenuItem
                          as={Box}
                          onClick={userLogout}
                          {...menu}
                          sx={{ p: 3, bg: 'gray.0', borderBottom: 0 }}
                        >
                          Signout
                        </MenuItem>
                      </Menu>
                    </Box>
                  </Flex>
                )}
              </Flex>
            )}
          </Flex>
        </Box>
      </Flex>
      <Modal isOpen={showSearch} onClose={closeSearch}>
        <Blok />
      </Modal>
    </Box>
  );
};
export default Nav;
