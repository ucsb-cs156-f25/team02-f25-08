import React from "react";
import { useBackend } from "main/utils/useBackend";

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBOrganizationTable from "main/components/UCSBOrganizations/UCSBOrganizationTable";
import { useCurrentUser, hasRole } from "main/utils/useCurrentUser";
import { Button } from "react-bootstrap";

export default function UCSBDiningCommonsMenuItemsIndexPage() {
  // Stryker disable all : placeholder for future implementation
  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Index page not yet implemented</h1>
        <p>
          <a href="/UCSBDiningCommonsMenuItems/create">Create</a>
        </p>
        <p>
          <a href="/UCSBDiningCommonsMenuItems/edit/1">Edit</a>
        </p>
      </div>
    </BasicLayout>
  );
}
