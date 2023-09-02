import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, catchError, combineLatest, map, startWith, tap } from 'rxjs';
import { DeclarativeCategoryService } from 'src/app/services/DeclarativeCategory.service';
import { DeclarativePostService } from 'src/app/services/DeclarativePost.service';
import { NotificationService } from 'src/app/services/Notification.service';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostFormComponent {
  postId = '';
  post$ = this.postService.post$.pipe(
    tap((post) => {
      post &&
        this.postForm.setValue({
          //@ts-ignore
          title: post?.title,
          //@ts-ignore
          description: post?.description,
          //@ts-ignore
          categoryId: post?.categoryId,
        });
    }),
    catchError((error) => {
      this.notificationService.setErrorMessage(error);
      return EMPTY;
    })
  );
  categories$ = this.categoryService.categories$;

  postForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    categoryId: new FormControl(''),
  });

  selectedPostId = this.route.paramMap.pipe(
    map((paramMap) => {
      let id = paramMap.get('id');
      if (id) {
        this.postId = id;
      }
      this.postService.selectPost(id + '');
      return id;
    })
  );

  notification$ = this.postService.postCRUDCompleteAction$.pipe(
    startWith(false),
    tap((message) => {
      if (message) {
        this.router.navigateByUrl('/declarativeposts');
      }
    })
  );

  vm$ = combineLatest([this.selectedPostId, this.post$, this.notification$]);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private postService: DeclarativePostService,
    private categoryService: DeclarativeCategoryService,
    private notificationService: NotificationService
  ) {}

  onPostSubmit() {
    let postDetails = this.postForm.value;

    if (this.postId) {
      // @ts-ignore
      postDetails = { ...postDetails, id: this.postId };

      // @ts-ignore
      this.postService.updatePost(postDetails);
    } else {
      // @ts-ignore
      this.postService.addPost(postDetails);
    }
  }
} // The End of Class;
