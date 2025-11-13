import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ArticlesCreatePage from "main/pages/Articles/ArticlesCreatePage";
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

describe("ArticlesCreatePage tests", () => {
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
          <ArticlesCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /articles", async () => {
    const queryClient = new QueryClient();
    const articles = {
      id: 4,
      title: "Article 4",
      url: "https://article4.com",
      explanation: "Article about article 4",
      email: "daliasebat4@gmail.com",
      dateAdded: "2022-04-02T12:00",
    };

    axiosMock.onPost("/api/articles/post").reply(202, articles);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toBeInTheDocument();
    });

    const titleInput = screen.getByLabelText("Title");
    // expect(nameInput).toBeInTheDocument();

    const urlInput = screen.getByLabelText("Url");
    // expect(urlInput).toBeInTheDocument();

    const explanationInput = screen.getByLabelText("Explanation");
    // expect(explanationInput).toBeInTheDocument();

    const emailInput = screen.getByLabelText("Email");

    const dateAddedInput = screen.getByTestId("ArticlesForm-dateAdded");

    fireEvent.change(titleInput, { target: { value: "Article 4" } });
    fireEvent.change(urlInput, { target: { value: "https://article4.com" } });
    fireEvent.change(explanationInput, { target: { value: "Article about article 4" } });
    fireEvent.change(emailInput, { target: { value: "daliasebat4@gmail.com" } });
    fireEvent.change(dateAddedInput, {
      target: { value: "2022-04-02T12:00" },
    });

    const createButton = screen.getByText("Create");
    expect(createButton).toBeInTheDocument();

    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      title: "Article 4",
      url: "https://article4.com",
      explanation: "Article about article 4",
      email: "daliasebat4@gmail.com",
      dateAdded: "2022-04-02T12:00",
    });

    // assert - check that the toast was called with the expected message
    expect(mockToast).toBeCalledWith(
      "New Article Created - id: 4 title: Article 4",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/articles" });
  });
});
