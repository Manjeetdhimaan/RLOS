import { Component, NgZone, Input, OnDestroy, OnInit } from '@angular/core';
import { Idle, DEFAULT_INTERRUPTSOURCES, AutoResume, EventTargetInterruptSource } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, NavigationExtras } from '@angular/router';

import { MatSnackBar } from '@angular/material';
import { HostListener } from '@angular/core';
// import { AppIdleDialog } from './../overlays/app-idle/app-idle.component';
import { CountdownSnackbarComponent } from '../timer';
import { Subscription } from 'rxjs';
import { MessageService } from '../../../../shared/services';
import { PersistanceService } from './../../../services/persistence.service';
import { AppConfigService } from './../../../services/app-config.service.';

@Component({
    selector: 'session-timer',
    templateUrl: './session-timer.component.html',
    styleUrls: ['./session-timer.component.scss']
})

export class SessionTimerDialog implements OnInit {
    public browserRefresh: boolean;
    idleState = 'Not started.';
    timedOut = false;
    lastPing?: Date = null;
    countTimer;
    idleTimeDuration = 600;
    timeoutDuration = 120;
    showTimer;
    message: any;
    subscription: Subscription;
    currentTimestamp;
    clickedTimestamp;
    checkTimeoutDuration;
    constructor(private router: Router, private idle: Idle, private messageService: MessageService, private appConfigService: AppConfigService,
        private keepalive: Keepalive, public dialog: MatDialog, public snackBar: MatSnackBar, private persistenceService: PersistanceService) {
        // this.browserRefresh = browserRefresh;

        setTimeout(() => {
            let appConfig = this.persistenceService.getApplicationConfig();
            if (appConfig) {
                this.idleTimeDuration = parseInt(appConfig.sessionTimeoutInterval) - parseInt(appConfig.signalTimeoutInterval);
                this.timeoutDuration = parseInt(appConfig.signalTimeoutInterval);
                this.clickedTimestamp = Math.round(new Date().getTime() / 1000);
                this.checkTimeoutDuration = this.timeoutDuration * 2;
                idle.setIdle(this.idleTimeDuration);
                idle.setTimeout(this.checkTimeoutDuration);
            }
        }, 1000);

        // setTimeout(() => {



        idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);


        // idle.onIdleEnd.subscribe(() => {
        //     this.idleState = 'No longer idle.';
        //     if (this.showTimer) {
        //         idle.clearInterrupts();
        //         this.reset();
        //     }
        // });

        idle.onIdleEnd.subscribe(() => {
            this.idleState = 'No longer idle.'
            // console.log(this.idleState);
            this.reset();
        });


        idle.onTimeout.subscribe(() => {
            if (this.router.routerState.snapshot.url.indexOf("error") > -1) {
                this.idle.stop();
            } else {
                let appData = this.persistenceService.getFromJourneyStorage();

                this.idle.stop();
                if (appData) {
                    // console.log('on Timeout');
                    this.dialog.closeAll();
                    let navigationExtras: NavigationExtras = {
                        queryParams: { 'httpCode': 5001, 'message': "Session has Expired." }
                    };
                    this.router.navigate(['session-timeout'], navigationExtras);
                }
            }
        });

        idle.onIdleStart.subscribe(() => {
            // console.log('You\'ve gone idle!');
        });

        idle.onTimeoutWarning.subscribe((countdown) => {
            if (this.router.routerState.snapshot.url.indexOf("error") > -1) {
                this.idle.stop();
            } else {
                let appData = this.persistenceService.getFromJourneyStorage();
                if (appData && countdown === this.timeoutDuration) {
                    this.currentTimestamp = Math.round(new Date().getTime() / 1000);
                    let timeDiff = this.currentTimestamp - this.clickedTimestamp;
                    if (timeDiff > this.timeoutDuration) {
                        const dialogConfig = new MatDialogConfig();
                        dialogConfig.disableClose = true;
                        dialogConfig.data = {
                            timeoutDuration: this.timeoutDuration
                        }
                        const dialogRef = this.dialog.open(CountdownSnackbarComponent, dialogConfig);
                        dialogRef.afterClosed().subscribe(result => {
                            if (result === "Y") {
                                this.refreshToken();
                            }
                            else if (result === "N") {
                                this.idle.setAutoResume(AutoResume.disabled);
                            }
                            else {
                                let navigationExtras: NavigationExtras = {
                                    queryParams: { 'httpCode': 5001, 'message': "Session has Expired." }
                                };
                                this.router.navigate(['session-timeout'], navigationExtras);
                            }
                        });

                    }
                    else {
                        this.refreshToken();
                    }
                }
            }
        });

        keepalive.interval(1);

        keepalive.onPing.subscribe(() => {
            // console.log(new Date().getTime());
        });

        this.reset();

        this.subscription = this.messageService.getMessage().subscribe(isReset => {
            if (isReset) {
                this.clickedTimestamp = Math.round(new Date().getTime() / 1000);
                this.reset();
                // this.persistenceService.getApplicationConfigToken().subscribe(response => {
                //     this.reset();
                // })
            }
        });
        // }, 2000)
    }

    ngOnInit() {
        this.idle.watch();
    }

    refreshToken() {
        this.persistenceService.getApplicationConfigToken().subscribe(response => {
            this.reset();
            // this.idle.setIdle(this.idleTimeDuration);
            // this.idle.setTimeout(this.checkTimeoutDuration);
            this.clickedTimestamp = Math.round(new Date().getTime() / 1000);
        })
    }

    reset() {
        this.idle.watch();
        this.idleState = 'Started.';
        this.timedOut = false;
    }

    cancel() {
        this.dialog.closeAll();
    }

    @HostListener('document:keypress', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        // this.reset();
        this.idle.watch();
        this.clickedTimestamp = null;
        this.clickedTimestamp = Math.round(new Date().getTime() / 1000);
    }

    @HostListener('document:click', ['$event'])
    documentClick(event: Event): void {
        this.idle.watch();
        this.clickedTimestamp = null;
        this.clickedTimestamp = Math.round(new Date().getTime() / 1000);
    }

}

