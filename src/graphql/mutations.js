export const processTask = /* GraphQL */ `
  mutation ProcessTask($task: String!, $sessionId: ID!) {
    processTask(task: $task, sessionId: $sessionId) {
      summary
      nivoData
    }
  }
`;
