import React from 'react';
import { useRouter } from 'next/router';
import Sidebar from './sidebar';
import { Box } from '@chakra-ui/react';
import Topbar from './topbar';
import { parseCookies } from 'nookies';

function Layout({ children }) {
  const router = useRouter();

  React.useEffect(() => {
    console.log(router.pathname);
    if (parseCookies().jwt)
      if (router.pathname === '/login') {
        router.replace('/dashboard');
      }

    if (!parseCookies().jwt) {
      if (router.pathname !== '/login' && router.pathname !== '/') {
        router.replace('/login');
      }
    }
  }, [router.pathname]);

  return (
    <Box color="gray.700">
      {router.pathname === '/' || router.pathname === '/login' ? (
        <Box>{children}</Box>
      ) : (
        <Sidebar>
          <Topbar />
          <Box px="8" py="4">
            {children}
          </Box>
        </Sidebar>
      )}
    </Box>
  );
}

export default Layout;
