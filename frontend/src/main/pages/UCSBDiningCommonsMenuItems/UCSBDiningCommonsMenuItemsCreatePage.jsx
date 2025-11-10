import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBDiningCommonsMenuItemsForm from "main/components/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsForm";
import { Navigate } from "react-router";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBDiningCommonsMenuItemsCreatePage({ storybook = false }) {
  // Stryker disable all : placeholder for future implementation
    return (
      <BasicLayout>
        <div className="pt-2">
          <h1>Create page not yet implemented</h1>
        </div>
      </BasicLayout>
    );
  }