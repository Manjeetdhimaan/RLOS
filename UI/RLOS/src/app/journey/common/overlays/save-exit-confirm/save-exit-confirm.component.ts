import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddCoApplicantDialog } from '..';

@Component({
  selector: 'app-save-exit-confirm',
  templateUrl: './save-exit-confirm.component.html',
  styleUrls: ['./save-exit-confirm.component.scss']
})
export class SaveExitConfirmComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AddCoApplicantDialog, any>) { }

  ngOnInit() {
  }


  confirmOrNot(confirmation): void {
    this.dialogRef.close(confirmation);
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

}
