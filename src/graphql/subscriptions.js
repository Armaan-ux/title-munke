/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateSearchHistory = /* GraphQL */ `
  subscription OnCreateSearchHistory(
    $filter: ModelSubscriptionSearchHistoryFilterInput
  ) {
    onCreateSearchHistory(filter: $filter) {
      id
      userId
      address
      searchId
      timestamp
      downloadLink
      status
      brokerId
      username
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateSearchHistory = /* GraphQL */ `
  subscription OnUpdateSearchHistory(
    $filter: ModelSubscriptionSearchHistoryFilterInput
  ) {
    onUpdateSearchHistory(filter: $filter) {
      id
      userId
      address
      searchId
      timestamp
      downloadLink
      status
      brokerId
      username
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteSearchHistory = /* GraphQL */ `
  subscription OnDeleteSearchHistory(
    $filter: ModelSubscriptionSearchHistoryFilterInput
  ) {
    onDeleteSearchHistory(filter: $filter) {
      id
      userId
      address
      searchId
      timestamp
      downloadLink
      status
      brokerId
      username
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateAuditLog = /* GraphQL */ `
  subscription OnCreateAuditLog($filter: ModelSubscriptionAuditLogFilterInput) {
    onCreateAuditLog(filter: $filter) {
      id
      userId
      action
      detail
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateAuditLog = /* GraphQL */ `
  subscription OnUpdateAuditLog($filter: ModelSubscriptionAuditLogFilterInput) {
    onUpdateAuditLog(filter: $filter) {
      id
      userId
      action
      detail
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteAuditLog = /* GraphQL */ `
  subscription OnDeleteAuditLog($filter: ModelSubscriptionAuditLogFilterInput) {
    onDeleteAuditLog(filter: $filter) {
      id
      userId
      action
      detail
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateRelationship = /* GraphQL */ `
  subscription OnCreateRelationship(
    $filter: ModelSubscriptionRelationshipFilterInput
  ) {
    onCreateRelationship(filter: $filter) {
      id
      agentId
      brokerId
      agentName
      brokerName
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateRelationship = /* GraphQL */ `
  subscription OnUpdateRelationship(
    $filter: ModelSubscriptionRelationshipFilterInput
  ) {
    onUpdateRelationship(filter: $filter) {
      id
      agentId
      brokerId
      agentName
      brokerName
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteRelationship = /* GraphQL */ `
  subscription OnDeleteRelationship(
    $filter: ModelSubscriptionRelationshipFilterInput
  ) {
    onDeleteRelationship(filter: $filter) {
      id
      agentId
      brokerId
      agentName
      brokerName
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateAgent = /* GraphQL */ `
  subscription OnCreateAgent($filter: ModelSubscriptionAgentFilterInput) {
    onCreateAgent(filter: $filter) {
      id
      name
      email
      status
      lastLogin
      assigned
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateAgent = /* GraphQL */ `
  subscription OnUpdateAgent($filter: ModelSubscriptionAgentFilterInput) {
    onUpdateAgent(filter: $filter) {
      id
      name
      email
      status
      lastLogin
      assigned
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteAgent = /* GraphQL */ `
  subscription OnDeleteAgent($filter: ModelSubscriptionAgentFilterInput) {
    onDeleteAgent(filter: $filter) {
      id
      name
      email
      status
      lastLogin
      assigned
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateBroker = /* GraphQL */ `
  subscription OnCreateBroker($filter: ModelSubscriptionBrokerFilterInput) {
    onCreateBroker(filter: $filter) {
      id
      name
      email
      status
      lastLogin
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateBroker = /* GraphQL */ `
  subscription OnUpdateBroker($filter: ModelSubscriptionBrokerFilterInput) {
    onUpdateBroker(filter: $filter) {
      id
      name
      email
      status
      lastLogin
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteBroker = /* GraphQL */ `
  subscription OnDeleteBroker($filter: ModelSubscriptionBrokerFilterInput) {
    onDeleteBroker(filter: $filter) {
      id
      name
      email
      status
      lastLogin
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateAdmins = /* GraphQL */ `
  subscription OnCreateAdmins($filter: ModelSubscriptionAdminsFilterInput) {
    onCreateAdmins(filter: $filter) {
      id
      name
      email
      status
      lastLogin
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateAdmins = /* GraphQL */ `
  subscription OnUpdateAdmins($filter: ModelSubscriptionAdminsFilterInput) {
    onUpdateAdmins(filter: $filter) {
      id
      name
      email
      status
      lastLogin
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteAdmins = /* GraphQL */ `
  subscription OnDeleteAdmins($filter: ModelSubscriptionAdminsFilterInput) {
    onDeleteAdmins(filter: $filter) {
      id
      name
      email
      status
      lastLogin
      createdAt
      updatedAt
      __typename
    }
  }
`;
