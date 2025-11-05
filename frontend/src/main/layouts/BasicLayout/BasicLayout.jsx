import { Container } from 'react-bootstrap';
import Footer from 'main/components/Nav/Footer';
import AppNavbar from 'main/components/Nav/AppNavbar';
import { useCurrentUser } from 'main/utils/useCurrentUser';
import { useLogout } from 'main/utils/useLogout';

import { useSystemInfo } from 'main/utils/systemInfo';

export default function BasicLayout({ children }) {
  const currentUser = useCurrentUser();
  const { data: systemInfo } = useSystemInfo();

  const doLogout = useLogout().mutate;

  return (
<<<<<<< HEAD
    <div className="d-flex flex-column min-vh-50">
      <AppNavbar
        currentUser={currentUser}
        systemInfo={systemInfo}
        doLogout={doLogout}
      />
      <Container expand="xl" className="pt-4 flex-grow-1">
=======
    <div className="d-flex flex-column min-vh-100">
      <AppNavbar currentUser={currentUser} systemInfo={systemInfo} doLogout={doLogout} />
      <Container expand="xl" className="flex-grow-1 pt-4">
>>>>>>> 7cfdeae7 (vn - added tests for HelpRequestForm;)
        {children}
      </Container>
      <Footer />
    </div>
  );
}
