package edu.ucsb.cs156.example.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import edu.ucsb.cs156.example.entities.RecommendationRequest;
import edu.ucsb.cs156.example.errors.EntityNotFoundException;
import edu.ucsb.cs156.example.repositories.RecommendationRequestRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.time.LocalDateTime;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** This is a REST controller for requests */
@Tag(name = "RecommendationRequest")
@RequestMapping("/api/recommendationrequest")
@RestController
@Slf4j
public class RecommendationRequestController extends ApiController {

  @Autowired RecommendationRequestRepository recommendationRequest;

  /**
   * List all records in table
   *
   * @return an iterable of records
   */
  @Operation(summary = "List all records")
  @PreAuthorize("hasRole('ROLE_USER')")
  @GetMapping("/all")
  public Iterable<RecommendationRequest> allRecords() {
    Iterable<RecommendationRequest> records = recommendationRequest.findAll();
    return records;
  }

  /**
   * Get a single date by id
   *
   * @param id the id of the date
   * @return a record
   */
  @Operation(summary = "Get a single record")
  @PreAuthorize("hasRole('ROLE_USER')")
  @GetMapping("")
  public RecommendationRequest getById(@Parameter(name = "id") @RequestParam Long id) {
    RecommendationRequest record =
        recommendationRequest
            .findById(id)
            .orElseThrow(() -> new EntityNotFoundException(RecommendationRequest.class, id));

    return record;
  }

  /**
   * Create a new record
   *
   * @param requesterEmail
   * @param professorEmail
   * @param explanation
   * @param dateRequested
   * @param dateNeeded
   * @param done
   * @return the saved record
   */
  @Operation(summary = "Create a new record")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  @PostMapping("/post")
  public RecommendationRequest postRecord(
      @Parameter(name = "requesterEmail") @RequestParam String requesterEmail,
      @Parameter(name = "professorEmail") @RequestParam String professorEmail,
      @Parameter(name = "explanation") @RequestParam String explanation,
      @Parameter(name = "dateNeeded") @RequestParam LocalDateTime dateNeeded,
      @Parameter(name = "done") @RequestParam Boolean done,
      @Parameter(
              name = "dateRequested",
              description =
                  "date (in iso format, e.g. YYYY-mm-ddTHH:MM:SS; see https://en.wikipedia.org/wiki/ISO_8601)")
          @RequestParam("dateRequested")
          @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
          LocalDateTime dateRequested)
      throws JsonProcessingException {

    // For an explanation of @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    // See: https://www.baeldung.com/spring-date-parameters

    log.info("localDateTime={}", dateRequested);

    RecommendationRequest record = new RecommendationRequest();
    record.setRequesterEmail(requesterEmail);
    record.setProfessorEmail(professorEmail);
    record.setExplanation(explanation);
    record.setDateRequested(dateRequested);
    record.setDateNeeded(dateNeeded);
    record.setDone(done);
    RecommendationRequest savedRecRequest = recommendationRequest.save(record);

    return savedRecRequest;
  }

  /**
   * Update a single date
   *
   * @param id id of the request to update
   * @param incoming the new rerquest
   * @return the updated request object
   */
  @Operation(summary = "Update a single request")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  @PutMapping("")
  public RecommendationRequest updateRequest(
      @Parameter(name = "id") @RequestParam Long id,
      @RequestBody @Valid RecommendationRequest incoming) {

    RecommendationRequest request1 =
        recommendationRequest
            .findById(id)
            .orElseThrow(() -> new EntityNotFoundException(RecommendationRequest.class, id));

    request1.setRequesterEmail(incoming.getRequesterEmail());
    request1.setProfessorEmail(incoming.getProfessorEmail());
    request1.setExplanation(incoming.getExplanation());
    request1.setDateRequested(incoming.getDateRequested());
    request1.setDateNeeded(incoming.getDateNeeded());
    request1.setDone(incoming.getDone());
    ;
    recommendationRequest.save(request1);

    return request1;
  }

  /**
   * Delete a RecommendationRequest
   *
   * @param id the id of the request to delete
   * @return a message indicating the request was deleted
   */
  @Operation(summary = "Delete a RecommendationRequest")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  @DeleteMapping("")
  public Object deleteRecommendationRequest(@Parameter(name = "id") @RequestParam Long id) {
    RecommendationRequest record2 =
        recommendationRequest
            .findById(id)
            .orElseThrow(() -> new EntityNotFoundException(RecommendationRequest.class, id));

    recommendationRequest.delete(record2);
    return genericMessage("recommendationRequest with id %s deleted".formatted(id));
  }
}
