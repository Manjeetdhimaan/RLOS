import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { DOMHelperService } from 'src/app/shared';
import { AuthService } from '../auth.service';
import { PersistanceService } from './../../core/services/persistence.service';
import { SecurityOverlay } from './overlay/security-dialog.component';
@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class StatusComponent implements OnInit {
  displayedColumns: string[] = ['arn', 'applicationType', 'applicationStatus', 'initiationDate', 'modifyDate', 'resumable'];
  dataSource = new MatTableDataSource();
  expandedElement: PeriodicElement;
  show = false;
  redirectDetails;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.dataSource.paginator = this.paginator;
  }

  public pageSize = 10;
  public currentPage = 0;
  public totalSize = 0;
  public array: any;

  pageEvent: PageEvent;
  constructor(private dom: DOMHelperService, private persistenceService: PersistanceService, private _route: Router,
    public dialog: MatDialog, private http: HttpClient, private authservice: AuthService) {
  }

  ngOnInit() {
    if (environment.isMockingEnabled) {
      var res = require('src/resources/mocks/application-dashboard.json');
      this.dataSource = new MatTableDataSource<Element>(res);
      this.array = res;
      this.totalSize = this.array.length;
      this.iterator();
      // this.dataSource.sort = this.sort;
    } else {
      var res = this.persistenceService.getFromStorage('APP')

      this.dataSource = new MatTableDataSource<Element>(res);
      this.array = res;
      this.totalSize = this.array.length;
      this.iterator();
      // this.dataSource.sort = this.sort;
    }

    //  UAT
    // this.http.get("/assets/configs/url-config/url-config.json").subscribe(data => {
    //   this.redirectDetails = data;
    // });

    //  PROD
    this.http.get("/resume/assets/configs/url-config/url-config.json").subscribe(data => {
      this.redirectDetails = data;
    });
  }

  handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.iterator();
  }

  private iterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.array.slice(start, end);
    this.dataSource = part;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  check(data) {
    if (data == 'arn')
      this.show = true;
    else
      this.show = false;
  }

  arn;
  openDialog(appType, arnNumber) {
    this.arn = arnNumber;
    this.authservice.getQuestions(appType, arnNumber)
      .subscribe((response) => {
        let that = this;
        const dialogRef = that.dialog.open(SecurityOverlay, {
          width: '45vw',
          disableClose: true,
          data: { appType: appType, arnNumber: arnNumber, questions: response },
          autoFocus: false
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.confirmation === "YES") {
            let context = result.appType.split('/');
            if (environment.production) {
              that.goToLink('/' + context[0] + '/#/redirect?arn=' + that.arn + '&journey=' + context[1]);
            } else {
              that.goToLink('http://localhost:5000/#/redirect?arn=' + that.arn + '&journey=' + context[1]);
            }

          }
        });
      })
  }

  openDialogs(appType, arn) {
    let context = '';
    if (appType === 'Loan') {
      context = 'rlos';
    } else {
      context = 'ao';
    }

    if (environment.production) {
      //For UAT
      // this.goToLink('http://10.10.40.160:8082/#/redirect?arn=' + arn + '&key=' + JSON.parse(sessionStorage.getItem('JMMB.TOKEN')));

      //For PROD
      //this.goToLink(this.redirectDetails.url.rlos_url + '/#/redirect?arn=' + arn + '&key=' + JSON.parse(sessionStorage.getItem('JMMB.TOKEN')));
     
      // http://localhost:4201/#/redirect?product=Equity%20Loan

      //For DEV
   //   this.goToLink('/' + context + '/#/redirect?arn=' + arn);
    // this.goToLink('http://192.168.153.141:8090/rlos/#/redirect?arn=' + arn + '&key=' + JSON.parse(sessionStorage.getItem('JMMB.TOKEN')));
    }
    else
    {
      //For DEV
      //  LOCAL HOST
    // this.goToLink('http://localhost:4201/#/redirect?arn=' + arn + '&key=' + JSON.parse(sessionStorage.getItem('JMMB.TOKEN')));
    
    //  DEV SERVER
     this.goToLink('http://192.168.153.47/jmmb/rlos/#/redirect?arn=' + arn + '&key=' + JSON.parse(sessionStorage.getItem('JMMB.TOKEN')));
    }

    // getStateColor(status) {
    //   switch (status) {
    //     case ('Submitted'):
    //     case (true):
    //       return 'green-svg';
    //       break;

    //     case (false):
    //       return 'gray-svg';
    //       break;
    //   }
    // }

  }

  goToLink(url: string) {
    window.open(url, "_self");
  }

}

export interface PeriodicElement {
  applicationType: string;
  arn: string;
  resumable: string;
  applicationStatus: number;
  initiationDate: number;
  modifyDate: string;
  message: string;
}