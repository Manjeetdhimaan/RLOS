import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-politically-exposed-person-readonly',
  templateUrl: './politically-exposed-person.read.component.html',
  styles: []
})
export class PoliticallyExposedPersonReadComponent implements OnInit {

  @Input() model;
  notSpecified;

  constructor() { }

  ngOnInit() {
    this.notSpecified = "Not Specified";
  }

}
