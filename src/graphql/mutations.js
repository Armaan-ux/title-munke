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
      createdAt
      updatedAt
      __typename
    }
  }
`;
