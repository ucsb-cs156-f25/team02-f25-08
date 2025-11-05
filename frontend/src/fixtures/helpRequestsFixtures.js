const helpRequestsFixtures = {
  oneHelpRequest: {
    id: 1,
    requesterEmail: 'vnarasiman@ucsb.edu',
    teamId: 'f25-08',
    tableOrBreakoutRoom: '8',
    requestTime: '2025-10-28T02:36',
    explanation:
      "f25-08: please note mvn test is not working and there's an error with the surefire plugin.",
    solved: true,
  },
  threeHelpRequests: [
    {
      id: 1,
      requesterEmail: 'vnarasiman@ucsb.edu',
      teamId: 'f25-08',
      tableOrBreakoutRoom: '8',
      requestTime: '2025-10-28T02:36',
      explanation:
        "f25-08: please note mvn test is not working and there's an error with the surefire plugin.",
      solved: true,
    },
    {
      id: 2,
      requesterEmail: 'siyudeng@ucsb.edu',
      teamId: 'f25-08',
      tableOrBreakoutRoom: '8',
      requestTime: '2025-10-29T02:36',
      explanation: 'f25-08: what to enter for type of boolean variables for UCSBOrganization?',
      solved: true,
      id: 2,
      requesterEmail: 'siyudeng@ucsb.edu',
      teamId: 'f25-08',
      tableOrBreakoutRoom: '8',
      requestTime: '2025-10-29T02:36',
      explanation: 'f25-08: what to enter for type of boolean variables for UCSBOrganization?',
      solved: true,
    },
    {
      id: 4,
      requesterEmail: 'daliasebat@ucsb.edu',
      teamId: 'f25-08',
      tableOrBreakoutRoom: '8',
      requestTime: '2025-10-29T02:36',
      explanation: 'f25-08: chromatic changes not showing',
      solved: false,
    },
  ],
};

export { helpRequestsFixtures };

