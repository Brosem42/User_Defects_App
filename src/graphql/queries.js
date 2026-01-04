export const listDefects = /* GraphQL */ `
  query ListDefects {
    listDefects {
      id
      version
      molding_machine_id
      timestamp
      object_detection {
        reject
        contamination_defect {
          pixel_severity {
            value
            min_value
            max_value
            threshold
          }
        }
      }
    }
  }
`;

export const getDefect = /* GraphQL */ `
  query GetDefect($id: ID!) {
    getDefect(id: $id) {
      id
      version
      molding_machine_id
      timestamp
      object_detection {
        reject
        contamination_defect {
          pixel_severity {
            value
          }
        }
      }
    }
  }
`;
