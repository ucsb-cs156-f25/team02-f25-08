import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router';
import HelpRequestsEditPage from 'main/pages/HelpRequests/HelpRequestsEditPage';

import { apiCurrentUserFixtures } from 'fixtures/currentUserFixtures';
import { systemInfoFixtures } from 'fixtures/systemInfoFixtures';
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import mockConsole from 'tests/testutils/mockConsole';

const mockToast = vi.fn();
vi.mock('react-toastify', async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    toast: vi.fn((x) => mockToast(x)),
  };
});

const mockNavigate = vi.fn();
vi.mock('react-router', async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    useParams: vi.fn(() => ({
      id: 17,
    })),
    Navigate: vi.fn((x) => {
      mockNavigate(x);
      return null;
    }),
  };
});

let axiosMock;
describe('HelpRequestsEditPage tests', () => {
  describe("when the backend doesn't return data", () => {
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock.onGet('/api/currentUser').reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock.onGet('/api/systemInfo').reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet('/api/helprequests', { params: { id: 17 } }).timeout();
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();
    test('renders header but form is not present', async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestsEditPage />
          </MemoryRouter>
        </QueryClientProvider>
      );
      await screen.findByText('Edit HelpRequest');
      expect(screen.queryByTestId('HelpRequest-requesterEmail')).not.toBeInTheDocument();
      restoreConsole();
    });
  });

  describe('tests where backend is working normally', () => {
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock.onGet('/api/currentUser').reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock.onGet('/api/systemInfo').reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet('/api/helprequests', { params: { id: 17 } }).reply(200, {
        id: 17,
        requesterEmail: 'vnarasiman@ucsb.edu',
        teamId: 'f25-08',
        tableOrBreakoutRoom: '8',
        requestTime: '2025-10-28T02:36',
        explanation:
          "f25-08: please note mvn test is not working and there's an error with the surefire plugin.",
        solved: true,
      });
      axiosMock.onPut('/api/helprequests').reply(200, {
        id: '17',
        requesterEmail: 'vnarasiman@umail.ucsb.edu',
        teamId: 'f25-008',
        tableOrBreakoutRoom: '08',
        requestTime: '2025-11-06T12:45',
        explanation: 'f25-008: surefire plugin error still unresolved after mvn clean.',
        solved: false,
      });
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();

    test('Is populated with the data provided, and changes when the data is changed', async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestsEditPage />
          </MemoryRouter>
        </QueryClientProvider>
      );

      await screen.findByTestId('HelpRequestForm-id');

      const idField = screen.getByTestId('HelpRequestForm-id');
      const requesterEmailField = screen.getByTestId('HelpRequestForm-requesterEmail');
      const teamIdField = screen.getByLabelText('Team ID');
      const tableOrBreakoutRoomField = screen.getByLabelText('Table or Breakout Room');
      const requestTimeField = screen.getByLabelText('Request Time (in UTC)');
      const explanationField = screen.getByLabelText('Explanation');
      const solvedField = screen.getByLabelText('Solved');
      const submitButton = screen.getByText('Update');

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue('17');

      expect(requesterEmailField).toBeInTheDocument();
      expect(requesterEmailField).toHaveValue('vnarasiman@ucsb.edu');

      expect(teamIdField).toBeInTheDocument();
      expect(teamIdField).toHaveValue('f25-08');

      expect(tableOrBreakoutRoomField).toBeInTheDocument();
      expect(tableOrBreakoutRoomField).toHaveValue('8');

      expect(requestTimeField).toBeInTheDocument();
      expect(requestTimeField).toHaveValue('2025-10-28T02:36');

      expect(explanationField).toBeInTheDocument();
      expect(explanationField).toHaveValue(
        "f25-08: please note mvn test is not working and there's an error with the surefire plugin."
      );

      expect(solvedField).toBeInTheDocument();
      expect(solvedField).toBeChecked();

      expect(submitButton).toHaveTextContent('Update');

      fireEvent.change(requesterEmailField, {
        target: { value: 'vnarasiman@umail.ucsb.edu' },
      });
      fireEvent.change(teamIdField, {
        target: { value: 'f25-008' },
      });
      fireEvent.change(tableOrBreakoutRoomField, {
        target: { value: '08' },
      });
      fireEvent.change(requestTimeField, {
        target: { value: '2025-11-06T12:45' },
      });
      fireEvent.change(explanationField, {
        target: { value: 'f25-008: surefire plugin error still unresolved after mvn clean.' },
      });
      fireEvent.click(solvedField);
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toHaveBeenCalled());
      expect(mockToast).toBeCalledWith(
        'HelpRequest Updated - id: 17 requester email: vnarasiman@umail.ucsb.edu'
      );

      expect(mockNavigate).toBeCalledWith({ to: '/helprequests' });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          requesterEmail: 'vnarasiman@umail.ucsb.edu',
          teamId: 'f25-008',
          tableOrBreakoutRoom: '08',
          requestTime: '2025-11-06T12:45',
          explanation: 'f25-008: surefire plugin error still unresolved after mvn clean.',
          solved: false,
        })
      ); // posted object
    });
  });
});
