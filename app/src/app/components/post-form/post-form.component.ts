import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, tap } from 'rxjs';
import { DeclarativeCategoryService } from 'src/app/services/DeclarativeCategory.service';
import { DeclarativePostService } from 'src/app/services/DeclarativePost.service';

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

  vm$ = combineLatest([this.selectedPostId, this.post$]);

  constructor(
    private route: ActivatedRoute,
    private postService: DeclarativePostService,
    private categoryService: DeclarativeCategoryService
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
