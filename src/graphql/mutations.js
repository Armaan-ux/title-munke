/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createSearchHistory = /* GraphQL */ `
  mutation CreateSearchHistory(
    $input: CreateSearchHistoryInput!
    $condition: ModelSearchHistoryConditionInput
  ) {
    createSearchHistory(input: $input, condition: $condition) {
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
export const updateSearchHistory = /* GraphQL */ `
  mutation UpdateSearchHistory(
    $input: UpdateSearchHistoryInput!
    $condition: ModelSearchHistoryConditionInput
  ) {
    updateSearchHistory(input: $input, condition: $condition) {
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
export const deleteSearchHistory = /* GraphQL */ `
  mutation DeleteSearchHistory(
    $input: DeleteSearchHistoryInput!
    $condition: ModelSearchHistoryConditionInput
  ) {
    deleteSearchHistory(input: $input, condition: $condition) {
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
export const createAuditLog = /* GraphQL */ `
  mutation CreateAuditLog(
    $input: CreateAuditLogInput!
    $condition: ModelAuditLogConditionInput
  ) {
    createAuditLog(input: $input, condition: $condition) {
      id
      userId
      action
      detail
      isAgent
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateAuditLog = /* GraphQL */ `
  mutation UpdateAuditLog(
    $input: UpdateAuditLogInput!
    $condition: ModelAuditLogConditionInput
  ) {
    updateAuditLog(input: $input, condition: $condition) {
      id
      userId
      action
      detail
      isAgent
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteAuditLog = /* GraphQL */ `
  mutation DeleteAuditLog(
    $input: DeleteAuditLogInput!
    $condition: ModelAuditLogConditionInput
  ) {
    deleteAuditLog(input: $input, condition: $condition) {
      id
      userId
      action
      detail
      isAgent
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createRelationship = /* GraphQL */ `
  mutation CreateRelationship(
    $input: CreateRelationshipInput!
    $condition: ModelRelationshipConditionInput
  ) {
    createRelationship(input: $input, condition: $condition) {
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
export const updateRelationship = /* GraphQL */ `
  mutation UpdateRelationship(
    $input: UpdateRelationshipInput!
    $condition: ModelRelationshipConditionInput
  ) {
    updateRelationship(input: $input, condition: $condition) {
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
export const deleteRelationship = /* GraphQL */ `
  mutation DeleteRelationship(
    $input: DeleteRelationshipInput!
    $condition: ModelRelationshipConditionInput
  ) {
    deleteRelationship(input: $input, condition: $condition) {
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
export const createAgent = /* GraphQL */ `
  mutation CreateAgent(
    $input: CreateAgentInput!
    $condition: ModelAgentConditionInput
  ) {
    createAgent(input: $input, condition: $condition) {
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
export const updateAgent = /* GraphQL */ `
  mutation UpdateAgent(
    $input: UpdateAgentInput!
    $condition: ModelAgentConditionInput
  ) {
    updateAgent(input: $input, condition: $condition) {
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
export const deleteAgent = /* GraphQL */ `
  mutation DeleteAgent(
    $input: DeleteAgentInput!
    $condition: ModelAgentConditionInput
  ) {
    deleteAgent(input: $input, condition: $condition) {
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
export const createBroker = /* GraphQL */ `
  mutation CreateBroker(
    $input: CreateBrokerInput!
    $condition: ModelBrokerConditionInput
  ) {
    createBroker(input: $input, condition: $condition) {
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
export const updateBroker = /* GraphQL */ `
  mutation UpdateBroker(
    $input: UpdateBrokerInput!
    $condition: ModelBrokerConditionInput
  ) {
    updateBroker(input: $input, condition: $condition) {
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
export const deleteBroker = /* GraphQL */ `
  mutation DeleteBroker(
    $input: DeleteBrokerInput!
    $condition: ModelBrokerConditionInput
  ) {
    deleteBroker(input: $input, condition: $condition) {
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
export const createAdmins = /* GraphQL */ `
  mutation CreateAdmins(
    $input: CreateAdminsInput!
    $condition: ModelAdminsConditionInput
  ) {
    createAdmins(input: $input, condition: $condition) {
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
export const updateAdmins = /* GraphQL */ `
  mutation UpdateAdmins(
    $input: UpdateAdminsInput!
    $condition: ModelAdminsConditionInput
  ) {
    updateAdmins(input: $input, condition: $condition) {
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
export const deleteAdmins = /* GraphQL */ `
  mutation DeleteAdmins(
    $input: DeleteAdminsInput!
    $condition: ModelAdminsConditionInput
  ) {
    deleteAdmins(input: $input, condition: $condition) {
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
