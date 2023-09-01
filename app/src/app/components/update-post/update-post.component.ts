import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { tap } from 'rxjs';
import { DeclarativeCategoryService } from 'src/app/services/DeclarativeCategory.service';
import { DeclarativePostService } from 'src/app/services/DeclarativePost.service';

@Component({
  selector: 'app-update-post',
  templateUrl: './update-post.component.html',
  styleUrls: ['./update-post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatePostComponent {
  postId: string = '';

  categories$ = this.categoryService.categories$;
  post$ = this.postService.post$.pipe(
    tap((post) => {
      this.postId = post?.id + '';
      this.postForm.setValue({
        // @ts-ignore
        title: post?.title,
        // @ts-ignore
        description: post?.description,
        // @ts-ignore
        categoryId: post?.categoryId,
      });
    })
  );

  postForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    categoryId: new FormControl(''),
  });

  constructor(
    private categoryService: DeclarativeCategoryService,
    private postService: DeclarativePostService
  ) {}

  onUpdatePost() {
    let postDetails = {
      ...this.postForm.value,
      id: this.postId,
    };

    // @ts-ignore
    this.postService.updatePost(postDetails);
  }
} // The End of Class;
