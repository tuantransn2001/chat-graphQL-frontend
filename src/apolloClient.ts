/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  gql,
  Observable,
  ApolloLink,
  split,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { createUploadLink } from "apollo-upload-client";
import { getMainDefinition } from "@apollo/client/utilities";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import { useUserStore } from "./stores/userStore";
import { onError } from "@apollo/client/link/error";
import { HTTP_BASE_URL, WS_BASE_URL } from "./common/common";

loadErrorMessages();
loadDevMessages();

async function refreshToken(client: ApolloClient<NormalizedCacheObject>) {
  try {
    const { data } = await client.mutate({
      mutation: gql`
        mutation RefreshToken {
          refreshToken
        }
      `,
    });
    const newAccessToken = data?.refreshToken;
    if (!newAccessToken) {
      throw new Error("New access token not received.");
    }
    return `Bearer ${newAccessToken}`;
  } catch (err) {
    throw new Error("Error getting new access token.");
  }
}
let retryCount = 0;
const maxRetry = 3;

const wsLink = new WebSocketLink({
  uri: WS_BASE_URL,
  options: {
    reconnect: true,
    connectionParams: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  },
});
const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (err.extensions.code === "UNAUTHENTICATED" && retryCount < maxRetry) {
        retryCount++;
        return new Observable((observer) => {
          refreshToken(client)
            .then((token) => {
              operation.setContext(
                (previousContext: Record<string, unknown>) => ({
                  headers: {
                    ...previousContext.headers,
                    authorization: token,
                  },
                })
              );
              const forward$ = forward(operation);
              forward$.subscribe(observer);
            })
            .catch((error) => observer.error(error));
        });
      }

      if (err.message === "Refresh token not found") {
        console.log("refresh token not found!");
        useUserStore.setState({
          id: undefined,
          fullname: "",
          email: "",
        });
      }
    }
  }
});

const uploadLink = createUploadLink({
  uri: HTTP_BASE_URL,
  credentials: "include",
  headers: {
    "apollo-require-preflight": "true",
  },
});
const link = split(
  // Split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  ApolloLink.from([errorLink, uploadLink])
);
export const client = new ApolloClient({
  uri: HTTP_BASE_URL,
  cache: new InMemoryCache({}),
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
  link: link,
});
