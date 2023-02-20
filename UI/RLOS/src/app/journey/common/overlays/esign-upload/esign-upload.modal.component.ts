import { Component, OnInit, Input, Output, EventEmitter, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SignaturePad } from 'angular2-signaturepad';


@Component({
  selector: 'esign-upload-dialog',
  templateUrl: 'esign-upload.modal.component.html',
  styleUrls: ['./esign-upload.modal.component.scss']
})
export class UploadEsignDialog {
  @ViewChild(SignaturePad) signaturePad: SignaturePad;

  signaturePadOptions: Object = {
    'minWidth': 5
  };

  constructor(
    public dialogRef: MatDialogRef<UploadEsignDialog, any>,
    @Inject(MAT_DIALOG_DATA) public dialogData) {
  }

  ngAfterViewInit() {
    // this.signaturePad is now available
    this.signaturePad.set('minWidth', 2); // set szimek/signature_pad options at runtime
    this.resizeCanvas();
    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
  }

  resizeCanvas() {
    let canvas = document.querySelectorAll("canvas")[0];
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    canvas.style.border = '1px solid grey';
  };

  drawComplete() {
    this.dialogData = [{
      docTypeCode: 'ESIGN',
      ext: 'JPG',
      name: "Esign.jpg",
      data: this.signaturePad.toDataURL()
    }]
  }

  drawStart() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}