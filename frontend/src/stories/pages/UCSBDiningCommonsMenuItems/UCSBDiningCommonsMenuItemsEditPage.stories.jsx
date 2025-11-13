import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import UCSBDiningCommonsMenuItemsEditPage from "main/pages/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsEditPage";
import { ucsbDiningCommonsMenuItemsFixtures } from "fixtures/ucsbDiningCommonsMenuItemsFixtures";

export default {
  title: "pages/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsEditPage",
  component: UCSBDiningCommonsMenuItemsEditPage,
};

const Template = () => <UCSBDiningCommonsMenuItemsEditPage storybook={true} />;

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
    http.get("/api/ucsbdiningcommonsmenuitems", () => {
      return HttpResponse.json(ucsbDiningCommonsMenuItemsFixtures.threeDiningCommonsMenuItems[0], {
        status: 200,
      });
    }),
    http.put("/api/ucsbdiningcommonsmenuitems", () => {
      return HttpResponse.json({}, { status: 200 });
    }),
    http.put("/api/ucsbdiningcommonsmenuitems", (req) => {
      window.alert("PUT: " + req.url + " and body: " + req.body);
      return HttpResponse.json({}, { status: 200 });
    }),
  ],
};
