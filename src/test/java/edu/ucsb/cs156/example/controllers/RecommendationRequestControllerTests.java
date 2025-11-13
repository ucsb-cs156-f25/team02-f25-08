package edu.ucsb.cs156.example.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.RecommendationRequest;
import edu.ucsb.cs156.example.repositories.RecommendationRequestRepository;
import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

@WebMvcTest(controllers = RecommendationRequestController.class)
@Import(TestConfig.class)
public class RecommendationRequestControllerTests extends ControllerTestCase {
  @MockBean RecommendationRequestRepository recommendationRequest;

  @MockBean UserRepository userRepository;

  @Test
  public void logged_out_users_cannot_get_all() throws Exception {
    mockMvc
        .perform(get("/api/recommendationrequest/all"))
        .andExpect(status().is(403)); // logged out users can't get all
  }

  @WithMockUser(roles = {"USER"})
  @Test
  public void logged_in_users_can_get_all() throws Exception {
    mockMvc.perform(get("/api/recommendationrequest/all")).andExpect(status().is(200)); // logged
  }

  @Test
  public void logged_out_users_cannot_post() throws Exception {
    mockMvc.perform(post("/api/recommendationrequest/post")).andExpect(status().is(403));
  }

  @WithMockUser(roles = {"USER"})
  @Test
  public void logged_in_regular_users_cannot_post() throws Exception {
    mockMvc
        .perform(post("/api/recommendationrequest/post"))
        .andExpect(status().is(403)); // only admins can post
  }

  @WithMockUser(roles = {"USER"})
  @Test
  public void logged_in_user_can_get_all_requests() throws Exception {

    // arrange
    LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");

    RecommendationRequest record1 =
        RecommendationRequest.builder()
            .requesterEmail("sriya.vollala@gmail.com")
            .professorEmail("sriyavollala@ucsb.edu")
            .explanation("rara")
            .dateNeeded(ldt1)
            .dateRequested(ldt1)
            .done(true)
            .build();

    LocalDateTime ldt2 = LocalDateTime.parse("2022-03-11T00:00:00");

    RecommendationRequest record2 =
        RecommendationRequest.builder()
            .requesterEmail("sriya.vollala@gmail.com")
            .professorEmail("sriyavollala@ucsb.edu")
            .explanation("rara")
            .dateNeeded(ldt2)
            .dateRequested(ldt2)
            .done(true)
            .build();

    ArrayList<RecommendationRequest> requestsList = new ArrayList<>();
    requestsList.addAll(Arrays.asList(record1, record2));

    when(recommendationRequest.findAll()).thenReturn(requestsList);

    // act
    MvcResult response =
        mockMvc
            .perform(get("/api/recommendationrequest/all"))
            .andExpect(status().isOk())
            .andReturn();

    // assert

    verify(recommendationRequest, times(1)).findAll();
    String expectedJson = mapper.writeValueAsString(requestsList);
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedJson, responseString);
  }

  @WithMockUser(roles = {"ADMIN", "USER"})
  @Test
  public void an_admin_user_can_post_a_new_request() throws Exception {
    // arrange

    LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");

    RecommendationRequest record1 =
        RecommendationRequest.builder()
            .requesterEmail("sriya.vollala@gmail.com")
            .professorEmail("sriyavollala@ucsb.edu")
            .explanation("rara")
            .dateNeeded(ldt1)
            .dateRequested(ldt1)
            .done(true)
            .build();

    when(recommendationRequest.save(eq(record1))).thenReturn(record1);

    // act
    MvcResult response =
        mockMvc
            .perform(
                post("/api/recommendationrequest/post?requesterEmail=sriya.vollala@gmail.com&professorEmail=sriyavollala@ucsb.edu&explanation=rara&dateNeeded=2022-01-03T00:00:00&dateRequested=2022-01-03T00:00:00&done=true")
                    .with(csrf()))
            .andExpect(status().isOk())
            .andReturn();

    // assert
    verify(recommendationRequest, times(1)).save(record1);
    String expectedJson = mapper.writeValueAsString(record1);
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedJson, responseString);
  }

  @Test
  public void logged_out_users_cannot_get_by_id() throws Exception {
    mockMvc
        .perform(get("/api/recommendationrequest?id=7"))
        .andExpect(status().is(403)); // logged out users can't get by id
  }

  @WithMockUser(roles = {"USER"})
  @Test
  public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {

    // arrange
    LocalDateTime ldt = LocalDateTime.parse("2022-01-03T00:00:00");

    RecommendationRequest record1 =
        RecommendationRequest.builder()
            .requesterEmail("sriya.vollala@gmail.com")
            .professorEmail("sriyavollala@ucsb.edu")
            .explanation("rara")
            .dateNeeded(ldt)
            .dateRequested(ldt)
            .done(true)
            .build();

    when(recommendationRequest.findById(eq(7L))).thenReturn(Optional.of(record1));

    // act
    MvcResult response =
        mockMvc
            .perform(get("/api/recommendationrequest?id=7"))
            .andExpect(status().isOk())
            .andReturn();

    // assert

    verify(recommendationRequest, times(1)).findById(eq(7L));
    String expectedJson = mapper.writeValueAsString(record1);
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedJson, responseString);
  }

  @WithMockUser(roles = {"USER"})
  @Test
  public void test_that_logged_in_user_can_get_by_id_when_the_id_does_not_exist() throws Exception {

    // arrange

    when(recommendationRequest.findById(eq(7L))).thenReturn(Optional.empty());

    // act
    MvcResult response =
        mockMvc
            .perform(get("/api/recommendationrequest?id=7"))
            .andExpect(status().isNotFound())
            .andReturn();

    // assert

    verify(recommendationRequest, times(1)).findById(eq(7L));
    Map<String, Object> json = responseToJson(response);
    assertEquals("EntityNotFoundException", json.get("type"));
    assertEquals("RecommendationRequest with id 7 not found", json.get("message"));
  }

  @WithMockUser(roles = {"ADMIN", "USER"})
  @Test
  public void admin_can_edit_an_existing_request() throws Exception {

    LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");
    LocalDateTime ldt2 = LocalDateTime.parse("2023-01-04T00:00:00");

    RecommendationRequest record1 =
        RecommendationRequest.builder()
            .requesterEmail("sriya.vollala@gmail.com")
            .professorEmail("sriyavollala@ucsb.edu")
            .explanation("rara")
            .dateNeeded(ldt1)
            .dateRequested(ldt1)
            .done(true)
            .build();

    RecommendationRequest record2 =
        RecommendationRequest.builder()
            .requesterEmail("s@gmail.com")
            .professorEmail("s@ucsb.edu")
            .explanation("yaya")
            .dateNeeded(ldt2)
            .dateRequested(ldt2)
            .done(false)
            .build();

    String requestBody = mapper.writeValueAsString(record2);

    when(recommendationRequest.findById(eq(67L))).thenReturn(Optional.of(record1));

    // act
    MvcResult response =
        mockMvc
            .perform(
                put("/api/recommendationrequest?id=67")
                    .contentType(MediaType.APPLICATION_JSON)
                    .characterEncoding("utf-8")
                    .content(requestBody)
                    .with(csrf()))
            .andExpect(status().isOk())
            .andReturn();

    verify(recommendationRequest, times(1)).findById(67L);
    verify(recommendationRequest, times(1)).save(record2);
    String responseString = response.getResponse().getContentAsString();
    assertEquals(requestBody, responseString);
  }

  @WithMockUser(roles = {"ADMIN", "USER"})
  @Test
  public void admin_cannot_edit_request_that_does_not_exist() throws Exception {
    // arrange

    LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");
    RecommendationRequest record2 =
        RecommendationRequest.builder()
            .requesterEmail("sriya.vollala@gmail.com")
            .professorEmail("sriyavollala@ucsb.edu")
            .explanation("rara")
            .dateNeeded(ldt1)
            .dateRequested(ldt1)
            .done(true)
            .build();

    String requestBody = mapper.writeValueAsString(record2);

    when(recommendationRequest.findById(eq(67L))).thenReturn(Optional.empty());

    // act
    MvcResult response =
        mockMvc
            .perform(
                put("/api/recommendationrequest?id=67")
                    .contentType(MediaType.APPLICATION_JSON)
                    .characterEncoding("utf-8")
                    .content(requestBody)
                    .with(csrf()))
            .andExpect(status().isNotFound())
            .andReturn();

    // assert
    verify(recommendationRequest, times(1)).findById(67L);
    Map<String, Object> json = responseToJson(response);
    assertEquals("RecommendationRequest with id 67 not found", json.get("message"));
  }

  @WithMockUser(roles = {"ADMIN", "USER"})
  @Test
  public void admin_can_delete_a_request() throws Exception {
    // arrange

    LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");

    RecommendationRequest record1 =
        RecommendationRequest.builder()
            .requesterEmail("sriya.vollala@gmail.com")
            .professorEmail("sriyavollala@ucsb.edu")
            .explanation("rara")
            .dateNeeded(ldt1)
            .dateRequested(ldt1)
            .done(true)
            .build();

    when(recommendationRequest.findById(eq(15L))).thenReturn(Optional.of(record1));

    // act
    MvcResult response =
        mockMvc
            .perform(delete("/api/recommendationrequest?id=15").with(csrf()))
            .andExpect(status().isOk())
            .andReturn();

    // assert
    verify(recommendationRequest, times(1)).findById(15L);
    verify(recommendationRequest, times(1)).delete(any());

    Map<String, Object> json = responseToJson(response);
    assertEquals("recommendationRequest with id 15 deleted", json.get("message"));
  }

  @WithMockUser(roles = {"ADMIN", "USER"})
  @Test
  public void admin_tries_to_delete_non_existant_request_and_gets_right_error_message()
      throws Exception {
    // arrange

    when(recommendationRequest.findById(eq(15L))).thenReturn(Optional.empty());

    // act
    MvcResult response =
        mockMvc
            .perform(delete("/api/recommendationrequest?id=15").with(csrf()))
            .andExpect(status().isNotFound())
            .andReturn();

    // assert
    verify(recommendationRequest, times(1)).findById(15L);
    Map<String, Object> json = responseToJson(response);
    assertEquals("RecommendationRequest with id 15 not found", json.get("message"));
  }
}
