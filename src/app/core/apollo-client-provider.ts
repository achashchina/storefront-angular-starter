import { isPlatformBrowser } from "@angular/common";
import { HttpHeaders } from "@angular/common/http";
import {
    inject,
    PLATFORM_ID,
    makeStateKey,
    TransferState,
    NgZone,
} from "@angular/core";
import {
    ApolloClientOptions,
    ApolloLink,
    InMemoryCache,
} from "@apollo/client/core";
import { onError } from '@apollo/client/link/error';
import { HttpLink, Options } from "apollo-angular/http";
import { environment } from "../../environments/environment";
import possibleTypesResult from "../common/introspection-results";
import { REQUEST } from "src/express.tokens";
import type { Request } from "express";

const STATE_KEY = makeStateKey<any>("apollo.state");
let apolloCache: InMemoryCache;

function relaceFields(existing: any, incoming: any) {
    return incoming;
}

function mergeFields(existing: any, incoming: any) {
    return { ...existing, ...incoming };
}

export function provideApolloClientOptions(): ApolloClientOptions<any> {
    const httpLink = inject(HttpLink);
    const ngZone = inject(NgZone);
    const platformId = inject(PLATFORM_ID);
    const transferState = inject(TransferState);
    const req = inject(REQUEST, { optional: true }) as Request | undefined;

    const AUTH_TOKEN_KEY = "auth_token";
    apolloCache = new InMemoryCache({
        possibleTypes: possibleTypesResult.possibleTypes,
        typePolicies: {
            Query: {
                fields: {
                    eligibleShippingMethods: {
                        merge: relaceFields,
                    },
                },
            },
            Product: {
                fields: {
                    customFields: {
                        merge: mergeFields,
                    },
                },
            },
            Collection: {
                fields: {
                    customFields: {
                        merge: mergeFields,
                    },
                },
            },
            Order: {
                fields: {
                    lines: {
                        merge: relaceFields,
                    },
                    shippingLines: {
                        merge: relaceFields,
                    },
                    discounts: {
                        merge: relaceFields,
                    },
                    shippingAddress: {
                        merge: relaceFields,
                    },
                    billingAddress: {
                        merge: relaceFields,
                    },
                },
            },
            Customer: {
                fields: {
                    addresses: {
                        merge: relaceFields,
                    },
                    customFields: {
                        merge: mergeFields,
                    },
                },
            },
        },
    });

    const { apiHost, apiPort, shopApiPath } = environment;
    const uri = `${apiHost}:${apiPort}/${shopApiPath}`;
    const options: Options = { uri, withCredentials: false };
    const http = httpLink.create(options) as unknown as ApolloLink;
    const errorLink = onError(({ graphQLErrors, networkError }) => {
        console.warn('SSR GraphQL errors:', graphQLErrors, networkError);
      });
    const afterware = new ApolloLink((operation, forward) => {
        return forward(operation).map((response) => {
          if (typeof window === 'undefined') {
            // SSR only, skip on client
            return response;
          }
      
          try {
            const context = operation.getContext();
            const headers = context?.response?.headers;
      
            if (headers && typeof headers.get === 'function') {
              const token = headers.get('vendure-auth-token');
              if (token) {
                localStorage.setItem(AUTH_TOKEN_KEY, token);
              }
            }
          } catch (err) {
            console.warn('[Apollo afterware error]', err);
          }
      
          return response;
        });
      });
      

    const middleware = new ApolloLink((operation, forward) => {
        if (isPlatformBrowser(platformId)) {
            operation.setContext({
                headers: new HttpHeaders().set(
                    "Authorization",
                    `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY) || ""}`
                ),
            });
        }
        return forward(operation);
    });

    const isBrowser = transferState.hasKey<any>(STATE_KEY);

    if (isBrowser) {
        const state = transferState.get<any>(STATE_KEY, null);
        apolloCache.restore(state);
    } else {
        transferState.onSerialize(STATE_KEY, () => apolloCache.extract());
        apolloCache.reset();
    }

    return ngZone.runOutsideAngular(() => {
        console.log(isBrowser);
        const ssrDelay = isBrowser ? 0 : 500;
    
        if (isBrowser) {
          const state = transferState.get<any>(STATE_KEY, null);
          apolloCache.restore(state);
        } else {
          transferState.onSerialize(STATE_KEY, () => apolloCache.extract());
          apolloCache.reset();
        }
    
        return {
          cache: apolloCache,
          ssrMode: !isBrowser,
          ssrForceFetchDelay: ssrDelay,
          link: ApolloLink.from([middleware, afterware, http]),
          errorLink
        } as ApolloClientOptions<any>;
      });
}
