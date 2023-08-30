import { Component } from '@angular/core';
import { LoaderService } from 'src/app/services/Loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'RxJS in Angular';
  showLoader$ = this.loaderService.loadingAction$;

  constructor(private loaderService: LoaderService) {}
}
