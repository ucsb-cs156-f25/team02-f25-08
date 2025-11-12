import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import UCSBOrganizationEditPage from "main/pages/UCSBOrganizations/UCSBOrganizationEditPage";
import { UCSBOrganizationFixtures } from "fixtures/UCSBOrganizationFixtures";

export default {
  title: "pages/UCSBOrganizations/UCSBOrganizationEditPage",
  component: UCSBOrganizationEditPage,
};

const Template = () => <UCSBOrganizationEditPage storybook={true} />;

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
    http.get("/api/ucsborganization", () => {
      return HttpResponse.json(
        UCSBOrganizationFixtures.threeUCSBOrganizations_allstring[0],
        {
          status: 200,
        },
      );
    }),
    // http.put("/api/ucsborganization", () => {
    //   return HttpResponse.json({}, { status: 200 });
    // }),
    http.put("/api/ucsborganization", () => {
      // window.alert("PUT: " + req.url + " and body: " + req.body);
      return HttpResponse.json(
        {
          id: 17,
          orgCode: "ZPR",
          orgTranslationShort: "ZETA PHI RHO",
          orgTranslation: "ZETA PHI RHO",
          inactive: "false",
        },
        { status: 200 },
      );
    }),
  ],
};
