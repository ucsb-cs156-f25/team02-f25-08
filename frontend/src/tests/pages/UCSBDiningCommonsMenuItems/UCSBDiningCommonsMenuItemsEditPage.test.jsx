import { render, screen } from "@testing-library/react";
import UCSBDiningCommonsMenuItemsEditPage from "main/pages/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsEditPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import UCSBDiningCommonsMenuItemsEditPage from "main/pages/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "tests/testutils/mockConsole";

// describe("UCSBDiningCommonsMenuItemsEditPage tests", () => {
//   const axiosMock = new AxiosMockAdapter(axios);

//   const setupUserOnly = () => {
//     axiosMock.reset();
//     axiosMock.resetHistory();
//     axiosMock
//       .onGet("/api/currentUser")
//       .reply(200, apiCurrentUserFixtures.userOnly);
//     axiosMock
//       .onGet("/api/systemInfo")
//       .reply(200, systemInfoFixtures.showingNeither);
//   };
// });

// const mockNavigate = vi.fn();
// vi.mock("react-router", async (importOriginal) => {
//   const originalModule = await importOriginal();
//   return {
//     ...originalModule,
//     useParams: vi.fn(() => ({
//       id: 17,
//     })),
//     Navigate: vi.fn((x) => {
//       mockNavigate(x);
//       return null;
//     }),
//   };
// });

// let axiosMock;
// describe("UCSBOrganizationEditPage tests", () => {
//   describe("when the backend doesn't return data", () => {
//     beforeEach(() => {
//       axiosMock = new AxiosMockAdapter(axios);
//       axiosMock.reset();
//       axiosMock.resetHistory();
//       axiosMock
//         .onGet("/api/currentUser")
//         .reply(200, apiCurrentUserFixtures.userOnly);
//       axiosMock
//         .onGet("/api/systemInfo")
//         .reply(200, systemInfoFixtures.showingNeither);
//       axiosMock
//         .onGet("/api/ucsborganization", { params: { id: 17 } })
//         .timeout();
//     });

//     // act
//     render(
//       <QueryClientProvider client={queryClient}>
//         <MemoryRouter>
//           <UCSBDiningCommonsMenuItemsEditPage />
//         </MemoryRouter>
//       </QueryClientProvider>,
//     );

//     const queryClient = new QueryClient();
//     test("renders header but table is not present", async () => {
//       const restoreConsole = mockConsole();

//       render(
//         <QueryClientProvider client={queryClient}>
//           <MemoryRouter>
//             <UCSBOrganizationEditPage />
//           </MemoryRouter>
//         </QueryClientProvider>,
//       );
//       await screen.findByText("Edit UCSBOrganization");
//       expect(
//         screen.queryByTestId("UCSBOrganization-orgCode"),
//       ).not.toBeInTheDocument();
//       restoreConsole();
//     });
//   });

//   describe("tests where backend is working normally", () => {
//     beforeEach(() => {
//       axiosMock = new AxiosMockAdapter(axios);
//       axiosMock.reset();
//       axiosMock.resetHistory();
//       axiosMock
//         .onGet("/api/currentUser")
//         .reply(200, apiCurrentUserFixtures.userOnly);
//       axiosMock
//         .onGet("/api/systemInfo")
//         .reply(200, systemInfoFixtures.showingNeither);
//       axiosMock
//         .onGet("/api/ucsborganization", { params: { id: 17 } })
//         .reply(200, {
//           id: 17,
//           orgCode: "ZPR",
//           orgTranslationShort: "ZETA PHI RHO",
//           orgTranslation: "ZETA PHI RHO",
//           inactive: "false",
//         });
//       axiosMock.onPut("/api/ucsborganization").reply(200, {
//         id: 17,
//         orgCode: "ZPR1",
//         orgTranslationShort: "ZETA PHI RHO11",
//         orgTranslation: "ZETA PHI RHO11",
//         inactive: "true",
//       });
//     });

//     afterEach(() => {
//       mockToast.mockClear();
//       mockNavigate.mockClear();
//       axiosMock.restore();
//       axiosMock.resetHistory();
//     });

//     const queryClient = new QueryClient();

//     test("Is populated with the data provided, and changes when data is changed", async () => {
//       render(
//         <QueryClientProvider client={queryClient}>
//           <MemoryRouter>
//             <UCSBOrganizationEditPage />
//           </MemoryRouter>
//         </QueryClientProvider>,
//       );

//       await screen.findByTestId("UCSBOrganizationForm-id");

//       const idField = screen.getByTestId("UCSBOrganizationForm-id");
//       const orgCodeField = screen.getByTestId("UCSBOrganizationForm-orgCode");
//       const orgTranslationShortField = screen.getByTestId(
//         "UCSBOrganizationForm-orgTranslationShort",
//       );
//       const orgTranslationField = screen.getByTestId(
//         "UCSBOrganizationForm-orgTranslation",
//       );
//       const inactiveField = screen.getByTestId("UCSBOrganizationForm-inactive");

//       const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

//       expect(idField).toBeInTheDocument();
//       expect(idField).toHaveValue("17");

//       expect(orgCodeField).toBeInTheDocument();
//       expect(orgCodeField).toHaveValue("ZPR");

//       expect(orgTranslationShortField).toBeInTheDocument();
//       expect(orgTranslationShortField).toHaveValue("ZETA PHI RHO");

//       expect(orgTranslationField).toBeInTheDocument();
//       expect(orgTranslationField).toHaveValue("ZETA PHI RHO");

//       expect(inactiveField).toBeInTheDocument();
//       expect(inactiveField).toHaveValue("false");

//       expect(submitButton).toHaveTextContent("Update");

//       fireEvent.change(orgCodeField, {
//         target: { value: "ZPR1" },
//       });

//       fireEvent.change(orgTranslationShortField, {
//         target: { value: "ZETA PHI RHO11" },
//       });

//       fireEvent.change(orgTranslationField, {
//         target: { value: "ZETA PHI RHO11" },
//       });

//       fireEvent.change(inactiveField, {
//         target: { value: "true" },
//       });

//       fireEvent.click(submitButton);

//       await waitFor(() => expect(mockToast).toBeCalled());
//       expect(mockToast).toHaveBeenCalledWith(
//         "UCSBOrganization Updated - id: 17 orgCode: ZPR1",
//       );

//       expect(mockNavigate).toHaveBeenCalledWith({ to: "/ucsborganizations" });

//       expect(axiosMock.history.put.length).toBe(1); // times called
//       expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
//       expect(axiosMock.history.put[0].data).toBe(
//         JSON.stringify({
//           // id: 17,
//           orgCode: "ZPR1",
//           orgTranslationShort: "ZETA PHI RHO11",
//           orgTranslation: "ZETA PHI RHO11",
//           inactive: "true",
//         }),
//       ); // posted object
//       expect(mockNavigate).toHaveBeenCalledWith({ to: "/ucsborganizations" });
//     });
//   });
// });
