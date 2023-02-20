import { Component, NgZone, Input, OnDestroy } from '@angular/core';
import { Idle, DEFAULT_INTERRUPTSOURCES, AutoResume } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, NavigationExtras } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';
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

export class SessionTimerDialog {
    public browserRefresh: boolean;
    idleState = 'Not started.';
    timedOut = false;
    lastPing?: Date = null;
    countTimer;
    idleTimeDuration = 1680;
    timeoutDuration = 120;
    showTimer;
    message: any;
    subscription: Subscription;
    currentTimestamp;
    clickedTimestamp;
    checkTimeoutDuration;
    refreshTokenInFlight: boolean = false;

    constructor(private router: Router, private idle: Idle, private messageService: MessageService, private appConfigService: AppConfigService,
        private keepalive: Keepalive, public dialog: MatDialog, public snackBar: MatSnackBar, private persistenceService: PersistanceService
    ) {
        let appConfig = this.persistenceService.getApplicationConfig();
        if (appConfig) {
            this.idleTimeDuration = parseInt(appConfig.sessionTimeoutInterval) - parseInt(appConfig.signalTimeoutInterval);
            this.timeoutDuration = parseInt(appConfig.signalTimeoutInterval);
            this.clickedTimestamp = Math.round(new Date().getTime() / 1000);
        }
        // this.checkTimeoutDuration = this.timeoutDuration * 2;

        // this.timeoutDuration = 30; //For testing purpose

        idle.setIdle(this.idleTimeDuration); // sets an idle timeout of 28 mins
        idle.setTimeout(this.timeoutDuration); // sets a timeout period of 2 mins. after 30 minsof inactivity, the user will be considered timed out.

        idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

        idle.onIdleEnd.subscribe(() => {
            this.idleState = 'No longer idle.';
            if (this.showTimer) {
                idle.clearInterrupts();
                this.reset();
            }
        });

        idle.onTimeout.subscribe(() => {
            if (this.router.routerState.snapshot.url.indexOf("error") > -1) {
                this.idle.stop();
            } else {
                let appData = this.persistenceService.getFromJourneyStorage();
                this.idle.stop();
                if (appData) {
                    this.dialog.closeAll();
                    let navigationExtras: NavigationExtras = {
                        queryParams: { 'httpCode': 5001, 'message': "Session has Expired." }
                    };
                    this.router.navigate(['session-timeout'], navigationExtras);
                }
            }
        });

        idle.onIdleStart.subscribe(() => {
            console.log('You\'ve gone idle!');
        });

        idle.onTimeoutWarning.subscribe((countdown) => {
            if (this.router.routerState.snapshot.url.indexOf("error") > -1) {
                this.idle.stop();
            } else {
                let appData = this.persistenceService.getFromJourneyStorage();
                if (appData && countdown === this.timeoutDuration) {
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
            }
        });

        keepalive.interval(30);

        keepalive.onPing.subscribe(() => {
            // console.log(new Date().getTime());
        });

        this.reset();

        this.subscription = this.messageService.getMessage().subscribe(isReset => {
            if (isReset) {
                this.clickedTimestamp = Math.round(new Date().getTime() / 1000);
                this.reset();
            }
        });
    }

    refreshToken() {
        const token: string = this.persistenceService.getToken();
        if (token) {
            this.refreshTokenInFlight = true;
            this.persistenceService.getApplicationConfigToken().subscribe(response => {
                if (response) {
                    this.reset();
                    this.refreshTokenInFlight = false;
                    this.clickedTimestamp = Math.round(new Date().getTime() / 1000);
                }
            });
        } else {
            this.reset();
            this.clickedTimestamp = Math.round(new Date().getTime() / 1000);
        }

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
        this.idle.watch();
        this.clickedTimestamp = null;
        this.clickedTimestamp = Math.round(new Date().getTime() / 1000);
        // const token: string = this.persistenceService.getToken();
        // if (token) {
        //     this.checkTokenExpiry();
        // }
    }

    @HostListener('document:click', ['$event'])
    documentClick(event: Event): void {
        this.idle.watch();
        this.clickedTimestamp = null;
        this.clickedTimestamp = Math.round(new Date().getTime() / 1000);

        // const token: string = this.persistenceService.getToken();
        // if (token) {
        //     this.checkTokenExpiry();
        // }

    }



    @HostListener('document:mouseenter', ['$event'])
    mouseenter() {
        this.idle.watch();
        this.clickedTimestamp = null;
        this.clickedTimestamp = Math.round(new Date().getTime() / 1000);
        // const token: string = this.persistenceService.getToken();
        // if (token) {
        //     this.checkTokenExpiry();
        // }
    }

    @HostListener('document:mouseover')
    mouseover() {
        this.idle.watch();
        this.clickedTimestamp = null;
        this.clickedTimestamp = Math.round(new Date().getTime() / 1000);
        // const token: string = this.persistenceService.getToken();
        // if (token) {
        //     this.checkTokenExpiry();
        // }
    }

    @HostListener('document:mousedown')
    mousedown() {
        this.idle.watch();
        this.clickedTimestamp = null;
        this.clickedTimestamp = Math.round(new Date().getTime() / 1000);
        // const token: string = this.persistenceService.getToken();
        // if (token) {
        //     this.checkTokenExpiry();
        // }
    }

    @HostListener('document:mouseup')
    mouseup() {
        this.idle.watch();
        this.clickedTimestamp = null;
        this.clickedTimestamp = Math.round(new Date().getTime() / 1000);

        // const token: string = this.persistenceService.getToken();
        // if (token) {
        //     this.checkTokenExpiry();
        // }
    }



    checkTokenExpiry() {
        setTimeout(() => {
            let appConfig = this.persistenceService.getApplicationConfig();
            let tokenGenerationTime = this.persistenceService.getTokeGenerationTime();
            let timeDiff = (this.clickedTimestamp - tokenGenerationTime) * 1000; // timediff in milli seconds
            var diffMins = Math.round(((timeDiff % 86400000) % 3600000) / 60000); // minutes
            let diffInSeconds = diffMins * 60;
            if (diffInSeconds >= this.timeoutDuration && diffInSeconds < parseInt(appConfig.sessionTimeoutInterval)) {
                if (!this.refreshTokenInFlight) {
                    this.refreshToken();
                }
            }
        }, 1000);
    }
}