import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MenuItemReviewsCreatePage from "main/pages/MenuItemReviews/MenuItemReviewsCreatePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

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
    Navigate: vi.fn((x) => {
      mockNavigate(x);
      return null;
    }),
  };
});

describe("MenuItemReviewsCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    vi.clearAllMocks();
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  const queryClient = new QueryClient();
  test("renders without crashing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewsCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Item Id")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /menuitemreviews", async () => {
    const queryClient = new QueryClient();
    const menuitemreview = {
      id: 1,
      itemId: 1,
      reviewerEmail: "krystellebaluyot@ucsb.edu",
      stars: 3,
      dateReviewed: "2022-01-02T12:00",
      comments: "yummy",
    };

    axiosMock.onPost("/api/menuitemreviews/post").reply(202, menuitemreview);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewsCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Item Id")).toBeInTheDocument();
    });

    const itemIdInput = screen.getByLabelText("Item Id");
    expect(itemIdInput).toBeInTheDocument();

    const reviewerEmailInput = screen.getByLabelText("Reviewer Email");
    expect(reviewerEmailInput).toBeInTheDocument();

    const starsInput = screen.getByLabelText("Stars");
    expect(starsInput).toBeInTheDocument();

    const dateReviewedInput = screen.getByLabelText(
      "Date Reviewed (iso format)",
    );
    expect(dateReviewedInput).toBeInTheDocument();

    const commentsInput = screen.getByLabelText("Comments");
    expect(commentsInput).toBeInTheDocument();

    const createButton = screen.getByText("Create");
    expect(createButton).toBeInTheDocument();

    fireEvent.change(itemIdInput, { target: { value: "1" } });
    fireEvent.change(reviewerEmailInput, {
      target: { value: "krystellebaluyot@ucsb.edu" },
    });
    fireEvent.change(starsInput, { target: { value: "3" } });
    fireEvent.change(dateReviewedInput, {
      target: { value: "2022-01-02T12:00" },
    });
    fireEvent.change(commentsInput, { target: { value: "yummy" } });

    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      itemId: "1",
      reviewerEmail: "krystellebaluyot@ucsb.edu",
      stars: "3",
      dateReviewed: "2022-01-02T12:00",
      comments: "yummy",
    });

    // assert - check that the toast was called with the expected message
    expect(mockToast).toHaveBeenCalledWith(
      "New Menu Item Review Created - id: 1 Reviewer Email: krystellebaluyot@ucsb.edu",
    );
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/menuitemreviews" });
  });
});
