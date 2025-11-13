import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import UCSBDiningCommonsMenuItemsCreatePage from "main/pages/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsCreatePage";

import { ucsbDiningCommonsMenuItemsFixtures } from "fixtures/ucsbDiningCommonsMenuItemsFixtures";

export default {
  title: "pages/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsCreatePage",
  component: UCSBDiningCommonsMenuItemsCreatePage,
};

const Template = () => <UCSBDiningCommonsMenuItemsCreatePage storybook={true} />;

export const Default = Template.bind({});
Default.parameters = {
  msw: [
    http.get("/api/currentUser", () => {
      return HttpResponse.json(apiCurrentUserFixtures.userOnly, {
        status: 200,
      });
    }),
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingNeither, {
        status: 200,
      });
    }),
    http.post("/api/ucsbdiningcommonsmenuitems/post", () => {
      return HttpResponse.json(ucsbDiningCommonsMenuItemsFixtures.oneDiningCommonsMenuItems, { status: 200 });
    }),
  ],
};
