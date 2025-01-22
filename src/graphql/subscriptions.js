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
      createdAt
      updatedAt
      __typename
    }
  }
`;
