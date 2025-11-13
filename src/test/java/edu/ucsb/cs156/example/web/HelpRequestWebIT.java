package edu.ucsb.cs156.example.web;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;
import edu.ucsb.cs156.example.entities.HelpRequest;
import edu.ucsb.cs156.example.repositories.HelpRequestRepository;
import java.time.LocalDateTime;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class HelpRequestWebIT extends WebTestCase {
  @Autowired HelpRequestRepository helpRequestRepository;

  @Test
  public void admin_user_can_create_edit_delete_help_request() throws Exception {
    LocalDateTime rqt1 = LocalDateTime.parse("2025-10-28T19:08:00");

    HelpRequest helpRequest1 =
        HelpRequest.builder()
            .requesterEmail("test@ucsb.edu")
            .teamId("f25-08")
            .tableOrBreakoutRoom("8")
            .requestTime(rqt1)
            .explanation("Test")
            .solved(true)
            .build();

    helpRequestRepository.save(helpRequest1);

    setupUser(true);

    page.getByText("Help Requests").click();

    assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requesterEmail"))
        .hasText("test@ucsb.edu");

    page.getByTestId("HelpRequestTable-cell-row-0-col-Edit-button").click();
    assertThat(page.getByText("Edit HelpRequest")).isVisible();
    page.getByTestId("HelpRequestForm-requesterEmail").fill("test_new@ucsb.edu");
    page.getByText("Update").click();

    assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requesterEmail"))
        .hasText("test_new@ucsb.edu");

    page.getByTestId("HelpRequestTable-cell-row-0-col-Delete-button").click();
    assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requesterEmail"))
        .not()
        .isVisible();
  }

  @Test
  public void regular_user_cannot_create_help_request() throws Exception {
    setupUser(false);

    page.getByText("Help Requests").click();

    assertThat(page.getByText("Create Help Requests")).not().isVisible();
    assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requesterEmail"))
        .not()
        .isVisible();
  }

  @Test
  public void admin_user_see_can_create_help_request_button() throws Exception {
    setupUser(true);

    page.getByText("Help Requests").click();

    assertThat(page.getByText("Create Help Requests")).isVisible();
  }
}
