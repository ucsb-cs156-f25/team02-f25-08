package edu.ucsb.cs156.example.web;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class UCSBDiningCommonsMenuItemsWebIT extends WebTestCase {
  @Test
  public void admin_user_can_create_edit_delete_diningcommonsmenuitem() throws Exception {
    setupUser(true);

    page.getByText("UCSB Dining Commons Menu Items").click();

    page.getByText("Create UCSBDiningCommonsMenuItem").click();
    assertThat(page.getByText("Create New UCSBDiningCommonsMenuItems")).isVisible();
    page.getByTestId("UCSBDiningCommonsMenuItemsForm-diningCommonsCode").fill("Ortega");
    page.getByTestId("UCSBDiningCommonsMenuItemsForm-name").fill("Pasta");
    page.getByTestId("UCSBDiningCommonsMenuItemsForm-station").fill("Take Out");
    page.getByTestId("UCSBDiningCommonsMenuItemsForm-submit").click();

    assertThat(page.getByTestId("UCSBDiningCommonsMenuItemsTable-cell-row-0-col-diningCommonsCode"))
        .hasText("Ortega");

    page.getByTestId("UCSBDiningCommonsMenuItemsTable-cell-row-0-col-Edit-button").click();
    assertThat(page.getByText("Edit UCSBDiningCommonsMenuItem")).isVisible();
    page.getByTestId("UCSBDiningCommonsMenuItemsForm-name").fill("Burrito");
    page.getByTestId("UCSBDiningCommonsMenuItemsForm-submit").click();

    assertThat(page.getByTestId("UCSBDiningCommonsMenuItemsTable-cell-row-0-col-name"))
        .hasText("Burrito");

    page.getByTestId("UCSBDiningCommonsMenuItemsTable-cell-row-0-col-Delete-button").click();

    assertThat(page.getByTestId("UCSBDiningCommonsMenuItemsTable-cell-row-0-col-name"))
        .not()
        .isVisible();
  }

  @Test
  public void regular_user_cannot_create_diningcommonsmenuitem() throws Exception {
    setupUser(false);

    page.getByText("UCSB Dining Commons Menu Items").click();

    assertThat(page.getByText("Create UCSBDiningCommonsMenuItem")).not().isVisible();
    assertThat(page.getByTestId("UCSBDiningCommonsMenuItemsTable-cell-row-0-col-name"))
        .not()
        .isVisible();
  }
}
