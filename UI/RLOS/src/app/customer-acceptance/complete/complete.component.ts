import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-complete',
  templateUrl: './complete.component.html',
  styleUrls: ['./complete.component.scss']
})
export class CompleteComponent implements OnInit {

  status;
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.status = 'NA';
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.activatedRoute.queryParams.subscribe(params => {
        if (params.status) {
          this.status = params.status;
        }
      });
    });
  }

}
