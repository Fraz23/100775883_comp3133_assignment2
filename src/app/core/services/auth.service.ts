import { inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, map, tap } from 'rxjs';
import { gql } from '@apollo/client/core';
import { AuthResponse, LoginInput, SignupInput } from '../models/auth.model';
import { SessionService } from './session.service';

interface AuthMutationResponse {
  signup?: AuthResponse;
  login?: AuthResponse;
}

const SIGNUP_MUTATION = gql`
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apollo = inject(Apollo);
  private readonly sessionService = inject(SessionService);

  signup(input: SignupInput): Observable<AuthResponse> {
    return this.apollo
      .mutate<AuthMutationResponse>({
        mutation: SIGNUP_MUTATION,
        variables: { input }
      })
      .pipe(
        map(({ data }) => {
          if (!data?.signup) {
            throw new Error('Signup response is empty.');
          }
          return data.signup;
        }),
        tap((auth) => this.sessionService.setSession(auth.token, auth.user))
      );
  }

  login(input: LoginInput): Observable<AuthResponse> {
    return this.apollo
      .mutate<AuthMutationResponse>({
        mutation: LOGIN_MUTATION,
        variables: { input }
      })
      .pipe(
        map(({ data }) => {
          if (!data?.login) {
            throw new Error('Login response is empty.');
          }
          return data.login;
        }),
        tap((auth) => this.sessionService.setSession(auth.token, auth.user))
      );
  }

  logout(): void {
    this.sessionService.clearSession();
  }
}
