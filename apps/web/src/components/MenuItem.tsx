import Link from 'next/link';
import { useRouter } from 'next/router';
import { Flex } from 'theme-ui';

export interface IMenuItem {
  children: any;
  href: string;
  path?: string;
  variant?: string;
}

const MenuItem = (props: IMenuItem) => {
  // const className = clsx(classNameProps, {
  //   [activeClassName]: router.pathname === pathname && activeClassName,
  // });

  const router = useRouter();
  const isActive =
    router.pathname === props.href ||
    (router.pathname.startsWith(props.href) && props.href !== '/');

  return (
    <Flex
      variant={props?.variant || 'btnMenuBlock'}
      sx={
        {
          // a: {
          //   textDecoration: 'none',
          //   color: 'text',
          //   py: 2,
          //   px: 1,
          //   width: '100%',
          //   '&.active': {
          //     background: '#E2F7EA',
          //     color: 'green.800',
          //     svg: {
          //       fill: 'green.300',
          //     },
          //   },
          //   ':hover': {
          //     background: '#E2F7EA',
          //   },
          // },
        }
      }>
      <Link
        href={props.href}
        as={props.path}
        className={isActive ? 'active' : ''}>
        {props.children}
      </Link>
    </Flex>
  );
};

export default MenuItem;