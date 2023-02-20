import { Component, OnInit } from '@angular/core';
import { JourneyService } from '../_root/journey.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-journey-footer',
  templateUrl: './journey-footer.component.html',
  styleUrls: ['./journey-footer.component.scss']
})
export class JourneyFooterComponent implements OnInit {

  constructor(private journeyservice: JourneyService, private _router: Router) { }

  ngOnInit() {
  }

  continue() {
    this._router.navigate(['/journey/get_started'])
  }

}
