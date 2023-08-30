import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Subject,
  catchError,
  combineLatest,
  delay,
  forkJoin,
  map,
  share,
  throwError,
} from 'rxjs';
import { IPost } from 'src/app/models/IPost';
import { DeclarativeCategoryService } from 'src/app/services/DeclarativeCategory.service';

@Injectable({
  providedIn: 'root',
})
export class DeclarativePostService {
  posts$ = this.http
    .get<{ [id: string]: IPost }>(
      `https://rxjs-posts-default-rtdb.firebaseio.com/posts.json`
    )
    .pipe(
      delay(2000),
      map((posts) => {
        let postsData: IPost[] = [];
        for (let id in posts) {
          postsData.push({ ...posts[id], id });
        }
        return postsData;
      }),
      catchError(this.handleError),
      share()
    );

  postsWithCategory$ = forkJoin([
    this.posts$,
    this.categoryService.categories$,
  ]).pipe(
    map(([posts, categories]) => {
      return posts.map((post) => {
        return {
          ...post,
          categoryName: categories.find(
            (category) => category.id === post.categoryId
          )?.title,
        } as IPost;
      });
    }),
    catchError(this.handleError)
  );

  private selectedPostSubject = new Subject<string>();
  selectedPostAction$ = this.selectedPostSubject.asObservable();

  post$ = combineLatest([
    this.postsWithCategory$,
    this.selectedPostAction$,
  ]).pipe(
    map(([posts, selectedPostId]) => {
      return posts.find((post) => post.id === selectedPostId);
    }),
    catchError(this.handleError)
  );

  constructor(
    private http: HttpClient,
    private categoryService: DeclarativeCategoryService
  ) {}

  selectPost(postId: string) {
    this.selectedPostSubject.next(postId);
  }

  handleError(error: Error) {
    return throwError(() => {
      return 'Unknown error occurred! Please try again!';
    });
  }
} // The End of Class;
