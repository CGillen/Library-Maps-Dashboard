import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class APIInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const baseUrl = environment.apiUrl;

    const apiReq = req.clone({ url: `${baseUrl}/${req.url}` });
    return next.handle(apiReq);
  }
}