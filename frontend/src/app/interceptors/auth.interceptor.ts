import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Get the auth token from local storage
    const token = localStorage.getItem('token');
    
    if (token) {
      // Parse the token
      const parsedToken = JSON.parse(token);
      
      // Clone the request and add the authorization header
      const authReq = request.clone({
        setHeaders: {
          Authorization: `${parsedToken.token_type} ${parsedToken.access_token}`
        }
      });
      
      // Send the newly created request
      return next.handle(authReq);
    }
    
    // If no token, just forward the request
    return next.handle(request);
  }
} 