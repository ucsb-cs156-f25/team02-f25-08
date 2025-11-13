const recommendationRequestFixtures = {
    oneRequest: {
        id: 1,
        requesterEmail: "sriya.vollala@gmail.com",
        professorEmail: "sriya.vollala@gmail.com",
        explanation: "rara",
        dateRequested: "2000-01-01T01:01:01",
        dateNeeded: "2000-01-01T01:01:01",
        done: true
    },
    threeRequests: [
      {
        id: 1,
        requesterEmail: "sriya.vollala@gmail.com",
        professorEmail: "sriya.vollala@gmail.com",
        explanation: "rara",
        dateRequested: "2000-01-01T01:01:01",
        dateNeeded: "2000-01-01T01:01:01",
        done: true
      },
      {
        id: 3,
        requesterEmail: "sriya.vollala@gmail.com",
        professorEmail: "sriyavollala@ucsb.edu",
        explanation: "yaya",
        dateRequested: "2000-01-01T01:01:01",
        dateNeeded: "2000-01-01T01:01:01",
        done: true
      },
      {
        id: 4,
        requesterEmail: "sriya.vollala@gmail.com",
        professorEmail: "sriyavollala@ucsb.edu",
        explanation: "new one",
        dateRequested: "1000-01-01T01:01:01",
        dateNeeded: "1000-01-01T01:01:01",
        done: true
      }
    ],
  };
  
  export { recommendationRequestFixtures };
  