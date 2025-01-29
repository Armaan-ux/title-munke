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
      brokerId
      username
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
        brokerId
        username
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
export const getRelationship = /* GraphQL */ `
  query GetRelationship($id: ID!) {
    getRelationship(id: $id) {
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
export const listRelationships = /* GraphQL */ `
  query ListRelationships(
    $filter: ModelRelationshipFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRelationships(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        agentId
        brokerId
        agentName
        brokerName
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getAgent = /* GraphQL */ `
  query GetAgent($id: ID!) {
    getAgent(id: $id) {
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
export const listAgents = /* GraphQL */ `
  query ListAgents(
    $filter: ModelAgentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAgents(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        email
        status
        lastLogin
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getBroker = /* GraphQL */ `
  query GetBroker($id: ID!) {
    getBroker(id: $id) {
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
export const listBrokers = /* GraphQL */ `
  query ListBrokers(
    $filter: ModelBrokerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBrokers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        email
        status
        lastLogin
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const relationshipsByAgentId = /* GraphQL */ `
  query RelationshipsByAgentId(
    $agentId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelRelationshipFilterInput
    $limit: Int
    $nextToken: String
  ) {
    relationshipsByAgentId(
      agentId: $agentId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        agentId
        brokerId
        agentName
        brokerName
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const relationshipsByBrokerId = /* GraphQL */ `
  query RelationshipsByBrokerId(
    $brokerId: String!
    $sortDirection: ModelSortDirection
    $filter: ModelRelationshipFilterInput
    $limit: Int
    $nextToken: String
  ) {
    relationshipsByBrokerId(
      brokerId: $brokerId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        agentId
        brokerId
        agentName
        brokerName
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
