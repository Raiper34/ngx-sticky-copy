import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

const MOCK_API_ENDPOINT = 'https://61801edb8bfae60017adf9b7.mockapi.io/data';

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
