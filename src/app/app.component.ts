import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

const MOCK_API_ENDPOINT = 'https://61917d5741928b001769007d.mockapi.io/users';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  stickyCode = '<div class="card" *scSticky>...</div>';
  stickyTheadCode = '<thead *scStickyThead>...</thead>';
  data$: Observable<any[]>;
  showStickyHead = false;

  constructor(private readonly http: HttpClient) {
    this.data$ = this.http.get<any[]>(MOCK_API_ENDPOINT);
  }

  toggleDemo(): void {
    this.showStickyHead = !this.showStickyHead;
  }
}
