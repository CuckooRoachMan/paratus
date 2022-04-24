import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http'
import {AuthService} from './auth.service'


@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req, next) {
    if(this.authService.loggedInDev()){
      let tokenizeReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${this.authService.getTokenDev()}`
        }
      });
      return next.handle(tokenizeReq);
    }
    let tokenizeReq = req.clone({
      setHeaders: {
      Authorization: `Bearer ${this.authService.getToken()}`
      }
    });
    return next.handle(tokenizeReq);
  }

}