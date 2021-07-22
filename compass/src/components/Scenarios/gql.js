import gql from 'graphql-tag';

export const createEqualityQuery = (name) => `$[*] ? (@ == "${name}" )`;

export const GET_SCENARIOS_LABEL_SCHEMA = gql`
  query {
    labelDefinition(key: "scenarios") {
      schema
    }
  }
`;

export const CREATE_SCENARIOS_LABEL = gql`
  mutation createLabelDefinition($in: LabelDefinitionInput!) {
    createLabelDefinition(in: $in) {
      key
      schema
    }
  }
`;

export const UPDATE_SCENARIOS = gql`
  mutation updateLabelDefinition($in: LabelDefinitionInput!) {
    updateLabelDefinition(in: $in) {
      key
      schema
    }
  }
`;

export const GET_APPLICATIONS = gql`
  query {
    entities: applications {
      data {
        name
        id
        labels
        bundles {
          data {
            id
          }
        }
      }
    }
  }
`;

export const REQUEST_BUNDLE_INSTANCE_AUTH_CREATION = gql`
  mutation requestBundleInstanceAuthCreation(
    $id: ID!
    $in: BundleInstanceAuthRequestInput!
  ) {
    requestBundleInstanceAuthCreation(bundleID: $id, in: $in) {
      id
    }
  }
`;

export const SET_BUNDLE_INSTANCE_AUTH = gql`
  mutation setBundleInstanceAuth($id: ID!, $in: BundleInstanceAuthSetInput!) {
    setBundleInstanceAuth(authID: $id, in: $in) {
      id
    }
  }
`;

export const GET_RUNTIMES = gql`
  query {
    entities: runtimes {
      data {
        name
        id
        labels
      }
    }
  }
`;

export const DELETE_APPLICATION_SCENARIOS_LABEL = gql`
  mutation deleteApplicationLabel($id: ID!) {
    deleteApplicationLabel(applicationID: $id, key: "scenarios") {
      key
      value
    }
  }
`;

export const SET_APPLICATION_SCENARIOS = gql`
  mutation setApplicationLabel($id: ID!, $scenarios: Any!) {
    setApplicationLabel(
      applicationID: $id
      key: "scenarios"
      value: $scenarios
    ) {
      key
      value
    }
  }
`;

export const DELETE_RUNTIME_SCENARIOS_LABEL = gql`
  mutation deleteRuntimeLabel($id: ID!) {
    deleteRuntimeLabel(runtimeID: $id, key: "scenarios") {
      key
      value
    }
  }
`;

export const SET_RUNTIME_SCENARIOS = gql`
  mutation setRuntimeLabel($id: ID!, $scenarios: Any!) {
    setRuntimeLabel(runtimeID: $id, key: "scenarios", value: $scenarios) {
      key
      value
    }
  }
`;

export const GET_APPLICATIONS_FOR_SCENARIO = gql`
  query applicationsForScenario($filter: [LabelFilter!]) {
    applications(filter: $filter) {
      data {
        name
        id
        labels
        packages {
          totalCount
        }
      }
      totalCount
    }
  }
`;

export const GET_RUNTIMES_FOR_SCENARIO = gql`
  query runtimesForScenario($filter: [LabelFilter!]) {
    runtimes(filter: $filter) {
      data {
        name
        id
        labels
      }
      totalCount
    }
  }
`;

export const GET_SCENARIO_ASSIGNMENTS = gql`
  query scenarioAssignments {
    automaticScenarioAssignments {
      data {
        scenarioName
        selector {
          key
          value
        }
      }
    }
  }
`;

export const GET_ASSIGNMENT_FOR_SCENARIO = gql`
  query assignmentForScenario($scenarioName: String!) {
    automaticScenarioAssignmentForScenario(scenarioName: $scenarioName) {
      scenarioName
      selector {
        key
        value
      }
    }
  }
`;

export const DELETE_ASSIGNMENT_FOR_SCENARIO = gql`
  mutation deleteAutomaticScenarioAssignmentForScenario(
    $scenarioName: String!
  ) {
    deleteAutomaticScenarioAssignmentForScenario(scenarioName: $scenarioName) {
      scenarioName
      selector {
        key
        value
      }
    }
  }
`;
