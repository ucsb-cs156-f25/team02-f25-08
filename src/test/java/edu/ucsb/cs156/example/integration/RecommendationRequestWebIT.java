package edu.ucsb.cs156.example.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.example.entities.RecommendationRequest;
import edu.ucsb.cs156.example.repositories.RecommendationRequestRepository;
import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.services.CurrentUserService;
import edu.ucsb.cs156.example.services.GrantedAuthoritiesService;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import java.time.LocalDateTime;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("integration")
@Import(TestConfig.class)
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class RecommendationRequestWebIT {
  @Autowired public CurrentUserService currentUserService;

  @Autowired public GrantedAuthoritiesService grantedAuthoritiesService;

  @Autowired RecommendationRequestRepository recommendationRequestRepository;

  @Autowired public MockMvc mockMvc;

  @Autowired public ObjectMapper mapper;

  @MockitoBean UserRepository userRepository;

  @WithMockUser(roles = {"USER"})
  @Test
  public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {
    // arrange

    LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");

    RecommendationRequest request1 =
        RecommendationRequest.builder()
            .requesterEmail("sriya.vollala@gmail.com")
            .professorEmail("sriyavollala@ucsb.edu")
            .explanation("rara")
            .dateNeeded(ldt1)
            .dateRequested(ldt1)
            .done(true)
            .build();

    recommendationRequestRepository.save(request1);

    // act
    MvcResult response =
        mockMvc
            .perform(get("/api/recommendationrequest?id=1"))
            .andExpect(status().isOk())
            .andReturn();

    // assert
    String expectedJson = mapper.writeValueAsString(request1);
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedJson, responseString);
  }

  @WithMockUser(roles = {"ADMIN", "USER"})
  @Test
  public void an_admin_user_can_post_a_new_request() throws Exception {
    // arrange

    LocalDateTime ldt2 = LocalDateTime.parse("2022-03-11T00:00:00");

    RecommendationRequest request2 =
        RecommendationRequest.builder()
            .requesterEmail("sriya.vollala@gmail.com")
            .professorEmail("sriyavollala@ucsb.edu")
            .explanation("rara")
            .dateNeeded(ldt2)
            .dateRequested(ldt2)
            .done(true)
            .build();

    // act
    MvcResult response =
        mockMvc
            .perform(
                post("/api/recommendationrequest/post")
                    .param("requesterEmail", "sriya.vollala@gmail.com")
                    .param("professorEmail", "sriyavollala@ucsb.edu")
                    .param("explanation", "rara")
                    .param("dateNeeded", "2022-03-11T00:00:00")
                    .param("dateRequested", "2022-03-11T00:00:00")
                    .param("done", "true")
                    .with(csrf()))
            .andExpect(status().isOk())
            .andReturn();
    // assert
    String responseString = response.getResponse().getContentAsString();
    RecommendationRequest actual = mapper.readValue(responseString, RecommendationRequest.class);

    assertEquals(request2.getRequesterEmail(), actual.getRequesterEmail());
    assertEquals(request2.getProfessorEmail(), actual.getProfessorEmail());
    assertEquals(request2.getExplanation(), actual.getExplanation());
    assertEquals(request2.getDateNeeded(), actual.getDateNeeded());
    assertEquals(request2.getDateRequested(), actual.getDateRequested());
    assertEquals(request2.getDone(), actual.getDone());
  }
}
