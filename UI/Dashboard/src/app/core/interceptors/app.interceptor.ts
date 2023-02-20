import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { LoaderService } from '../components/common/loader/loader.service';
import { PersistanceService } from '../services';
import { Router, NavigationExtras } from '@angular/router';


@Injectable()
export class AppInterceptor implements HttpInterceptor {
  private totalRequests = 0;
  constructor(private _loaderService: LoaderService,
    private persistenceService: PersistanceService, private router: Router) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.totalRequests++;
    this._loaderService.show();

    const token: string = this.persistenceService.getToken();

    if (token) {
      request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
    }

    // if (!request.headers.has('Content-Type')) {
    //     request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
    // }

    // request = request.clone({ headers: request.headers.set('Accept', 'application/json') });

    return next.handle(request).pipe(
      tap(response => {
        if (response instanceof HttpResponse) {
          this.decreaseRequests();
          let token: string = "";
          const keys = response.headers.keys();

          let headers = keys.map(key => {
            if (key === "authentication") {
              token = response.headers.get(key);
            }
          });

          if (token) {
            this.persistenceService.setToken(token);
          }
          // this.messageService.sendMessage(true);
        }
      }),
      catchError(error => {
        this.decreaseRequests();
        if (error.status === 401) {
          if (!error.error.message) {
            var el = document.createElement('html');
            el.innerHTML = error.error;
            var content = el.getElementsByTagName('body');
            let err = JSON.parse(content[0].innerHTML);
            let navigationExtras: NavigationExtras = {
              queryParams: { 'httpCode': err.exceptionCode, 'message': err.description }
            };
            this.router.navigate(['error'], navigationExtras);
          }
          else {
            let navigationExtras: NavigationExtras = {
              queryParams: { 'httpCode': JSON.parse(error.error.message).exceptionCode, 'message': JSON.parse(error.error.message).description }
            };
            this.router.navigate(['error'], navigationExtras);
          }
        }
        throw error;
      })
    );
  }


  private decreaseRequests() {
    this.totalRequests--;
    if (this.totalRequests === 0) {
      this._loaderService.hide();
    }
  }
}