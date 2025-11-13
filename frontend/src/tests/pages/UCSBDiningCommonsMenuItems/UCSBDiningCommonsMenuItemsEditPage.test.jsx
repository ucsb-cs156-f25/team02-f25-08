import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import UCSBDiningCommonsMenuItemsEditPage from "main/pages/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsEditPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import UCSBDiningCommonsMenuItemsEditPage from "main/pages/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "tests/testutils/mockConsole";

const mockToast = vi.fn();
vi.mock("react-toastify", async (importOriginal) => {
    const originalModule = await importOriginal();
    return {
        ...originalModule,
        toast: vi.fn((x) => mockToast(x)),
    };
});

const mockNavigate = vi.fn();
vi.mock("react-router", async (importOriginal) => {
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
describe("UCSBDiningCommonsMenuItemsEditPage tests", () => {
    describe("when the backend doesn't return data", () => {
        beforeEach(() => {
        axiosMock = new AxiosMockAdapter(axios);
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock
            .onGet("/api/currentUser")
            .reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock
            .onGet("/api/systemInfo")
            .reply(200, systemInfoFixtures.showingNeither);
        axiosMock.onGet("/api/ucsbdiningcommonsmenuitems", { params: { id: 17 } }).timeout();
        });

        afterEach(() => {
            mockToast.mockClear();
            mockNavigate.mockClear();
            axiosMock.restore();
            axiosMock.resetHistory();
        });

    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {
        const restoreConsole = mockConsole();

        render(
            <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <UCSBDiningCommonsMenuItemsEditPage />
            </MemoryRouter>
            </QueryClientProvider>,
        );
        await screen.findByText("Edit UCSBDiningCommonsMenuItem");
        expect(screen.queryByTestId("UCSBDiningCommonsMenuItems-diningCommonsCode")).not.toBeInTheDocument();
        restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {
        beforeEach(() => {
        axiosMock = new AxiosMockAdapter(axios);
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock
            .onGet("/api/currentUser")
            .reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo")
            .reply(200, systemInfoFixtures.showingNeither);
        axiosMock.onGet("/api/ucsbdiningcommonsmenuitems", { params: { id: 17 } }).reply(200, {
            id: 17,
            diningCommonsCode: "Carillo",
            name: "Pizza",
            station: "Western",
        });
        axiosMock.onPut("/api/ucsbdiningcommonsmenuitems").reply(200, {
            id: "17",
            diningCommonsCode: "Ortega",
            name: "Pasta",
            station: "Take Out",
        });
    });

    afterEach(() => {
        mockToast.mockClear();
        mockNavigate.mockClear();
        axiosMock.restore();
        axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided, and changes when data is changed", async () => {
        render(
            <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <UCSBDiningCommonsMenuItemsEditPage />
            </MemoryRouter>
            </QueryClientProvider>,
        );

        await screen.findByTestId("UCSBDiningCommonsMenuItemsForm-id");

        const idField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-id");
        const diningCommonsCodeField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-diningCommonsCode");
        const nameField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-name");
        const stationField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-station");
        const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-submit");

        expect(idField).toBeInTheDocument();
        expect(idField).toHaveValue("17");

        expect(diningCommonsCodeField).toBeInTheDocument();
        expect(diningCommonsCodeField).toHaveValue("Carillo");

        expect(nameField).toBeInTheDocument();
        expect(nameField).toHaveValue("Pizza");

        expect(stationField).toBeInTheDocument();
        expect(stationField).toHaveValue("Western");

        expect(submitButton).toHaveTextContent("Update");

        fireEvent.change(diningCommonsCodeField, {
            target: { value: "Ortega" },
        });

        fireEvent.change(nameField, {
            target: { value: "Pasta" },
        });

        fireEvent.change(stationField, {
            target: { value: "Take Out" },
        });

        fireEvent.click(submitButton);

        await waitFor(() => expect(mockToast).toBeCalled());
        expect(mockToast).toHaveBeenCalledWith(
            "DiningCommonsMenuItem Updated - id: 17 name: Pasta",
        );

        expect(mockNavigate).toHaveBeenCalledWith({ to: "/ucsbdiningcommonsmenuitems" });

        expect(axiosMock.history.put.length).toBe(1); // times called
        expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
        expect(axiosMock.history.put[0].data).toBe(
            JSON.stringify({
                // id: 17,
                diningCommonsCode: "Ortega",
                name: "Pasta",
                station: "Take Out",
            }),
        ); // posted object
    });

    test("Changes when you click Update", async () => {
        render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
            <UCSBDiningCommonsMenuItemsEditPage />
            </MemoryRouter>
        </QueryClientProvider>,
        );

        await screen.findByTestId("UCSBDiningCommonsMenuItemsForm-id");

        const idField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-id");
        const diningCommonsCodeField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-diningCommonsCode");
        const nameField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-name");
        const stationField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-station");
        const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-submit");

        expect(idField).toHaveValue("17");
        expect(diningCommonsCodeField).toHaveValue("Carillo");
        expect(nameField).toHaveValue("Pizza");
        expect(stationField).toHaveValue("Western");
        expect(submitButton).toBeInTheDocument();

        fireEvent.change(diningCommonsCodeField, {
            target: { value: "Ortega" },
        });

        fireEvent.change(nameField, {
            target: { value: "Pasta" },
        });

        fireEvent.change(stationField, {
            target: { value: "Take Out" },
        });

        fireEvent.click(submitButton);

        await waitFor(() => expect(mockToast).toBeCalled());
        expect(mockToast).toBeCalledWith(
        "DiningCommonsMenuItem Updated - id: 17 name: Pasta",
        );
        expect(mockNavigate).toBeCalledWith({ to: "/ucsbdiningcommonsmenuitems" });
    });
    });
});
