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
