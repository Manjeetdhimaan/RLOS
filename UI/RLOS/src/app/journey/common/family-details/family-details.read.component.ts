import { Component, OnInit , Input} from '@angular/core';

@Component({
  selector: 'app-family-details-readonly',
  templateUrl: './family-details.read.component.html',
  styles: []
})
export class FamilyDetailsReadComponent implements OnInit {

  @Input() model;
  notSpecified;


  constructor() { }

  ngOnInit() {
    this.notSpecified = "Not Specified";
  }

}
