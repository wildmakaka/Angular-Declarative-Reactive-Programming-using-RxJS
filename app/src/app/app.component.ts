import { ChangeDetectionStrategy, Component } from '@angular/core';
import { tap } from 'rxjs';
import { LoaderService } from 'src/app/services/Loader.service';
import { NotificationService } from 'src/app/services/Notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'RxJS in Angular';
  showLoader$ = this.loaderService.loadingAction$;
  successMessage$ = this.notificationService.successMessageAction$.pipe(
    tap((message) => {
      setTimeout(() => {
        this.notificationService.clearAllMessages();
      }, 3000);
    })
  );
  errorMessage$ = this.notificationService.errorMessageAction$.pipe(
    tap((message) => {
      setTimeout(() => {
        this.notificationService.clearAllMessages();
      }, 3000);
    })
  );

  constructor(
    private loaderService: LoaderService,
    private notificationService: NotificationService
  ) {}
} // The End of Class;
