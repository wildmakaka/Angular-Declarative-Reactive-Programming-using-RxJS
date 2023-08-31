import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, EMPTY, catchError, tap } from 'rxjs';
import { DeclarativePostService } from 'src/app/services/DeclarativePost.service';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SinglePostComponent {
  showUpdatePost = false;
  errorMessageSubject = new BehaviorSubject<string>('');
  errorMessageAction$ = this.errorMessageSubject.asObservable();

  errorMessage = '';

  post$ = this.postService.post$.pipe(
    tap((post) => {
      this.showUpdatePost = false;
    }),
    catchError((error: string) => {
      this.errorMessageSubject.next(error);
      return EMPTY;
    })
  );

  constructor(private postService: DeclarativePostService) {}

  onUpdatePost() {
    this.showUpdatePost = true;
  }
} // The End of Class;
