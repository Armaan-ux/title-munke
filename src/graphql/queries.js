/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getSearchHistory = /* GraphQL */ `
  query GetSearchHistory($id: ID!) {
    getSearchHistory(id: $id) {
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
export const listSearchHistories = /* GraphQL */ `
  query ListSearchHistories(
    $filter: ModelSearchHistoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSearchHistories(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getAuditLog = /* GraphQL */ `
  query GetAuditLog($id: ID!) {
    getAuditLog(id: $id) {
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
export const listAuditLogs = /* GraphQL */ `
  query ListAuditLogs(
    $filter: ModelAuditLogFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAuditLogs(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userId
        action
        detail
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
