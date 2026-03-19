import { inject, ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { ApolloLink, InMemoryCache } from '@apollo/client/core';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { SessionService } from './core/services/session.service';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      const sessionService = inject(SessionService);

      const authLink = new ApolloLink((operation, forward) => {
        const token = sessionService.token();
        operation.setContext(({ headers = {} }) => {
          const nextHeaders = headers as Record<string, string>;
          return {
            headers: token
              ? {
                  ...nextHeaders,
                  Authorization: `Bearer ${token}`
                }
              : nextHeaders
          };
        });

        return forward(operation);
      });

      return {
        cache: new InMemoryCache(),
        link: ApolloLink.from([authLink, httpLink.create({ uri: environment.graphqlUri })])
      };
    }),
    provideRouter(routes)
  ]
};
