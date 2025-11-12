import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import UCSBDiningCommonsMenuItemsForm from "main/components/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsForm";
import { ucsbDiningCommonsMenuItemsFixtures } from "fixtures/ucsbDiningCommonsMenuItemsFixtures";
import { BrowserRouter as Router } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const originalModule = await vi.importActual("react-router");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

describe("UCSBDiningCommonsMenuItemsForm tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = ["Dining Commons Code", "Name", "Station"];

  test("renders correctly with no initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBDiningCommonsMenuItemsForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });
  });

  test("renders correctly when passing in initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBDiningCommonsMenuItemsForm initialContents={ucsbDiningCommonsMenuItemsFixtures.oneDiningCommonsMenuItems} />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByText(`Id`)).toBeInTheDocument();

  });


  test("renders correctly when passing in a UCSBDiningCommonsMenuItems", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemsForm initialContents={ucsbDiningCommonsMenuItemsFixtures.oneDiningCommonsMenuItems} />
      </Router>,
    );
    
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

  });

  test("Correct Error messsages on missing input", async () => {
      render(
      <Router>
        <UCSBDiningCommonsMenuItemsForm />
      </Router>,
    );
    
    await screen.findByTestId("UCSBDiningCommonsMenuItemsForm-submit");
    const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-submit");

    fireEvent.click(submitButton);

    expect(await screen.findByText(/Dining Commons Code is required./)).toBeInTheDocument();
    expect(await screen.findByText(/Name is required./)).toBeInTheDocument();
    expect(await screen.findByText(/Station is required./)).toBeInTheDocument();
  });

  test("No Error messsages on good input", async () => {
    const mockSubmitAction = vi.fn();

    render(
      <Router>
        <UCSBDiningCommonsMenuItemsForm submitAction={mockSubmitAction} />
      </Router>,
    );
    await screen.findByTestId("UCSBDiningCommonsMenuItemsForm-diningCommonsCode");

    const diningCommonsCodeField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-diningCommonsCode");
    const nameField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-name");
    const stationField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-station");
    const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-submit");

    fireEvent.change(diningCommonsCodeField, { target: { value: "ortega" } });
    fireEvent.change(nameField, { target: { value: "pesto pasta" } });
    fireEvent.change(stationField, {
      target: { value: "takeout" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemsForm />
      </Router>,
    );
    await screen.findByTestId("UCSBDiningCommonsMenuItemsForm-cancel");
    const cancelButton = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-cancel");

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
