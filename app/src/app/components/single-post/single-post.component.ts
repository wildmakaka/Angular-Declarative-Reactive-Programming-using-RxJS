import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, EMPTY, catchError, tap } from 'rxjs';
import { IPost } from 'src/app/models/IPost';
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

  onDeletePost(post: IPost) {
    if (confirm('Are you sure you want ot delete?')) {
      this.postService.deletePost(post);
    }
  }
} // The End of Class;
