import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Subject,
  catchError,
  combineLatest,
  forkJoin,
  map,
  merge,
  scan,
  shareReplay,
  throwError,
} from 'rxjs';
import { CRUDAction, IPost } from 'src/app/models/IPost';
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
      map((posts) => {
        let postsData: IPost[] = [];
        for (let id in posts) {
          postsData.push({ ...posts[id], id });
        }
        return postsData;
      }),
      catchError(this.handleError),
      shareReplay(1)
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
    catchError(this.handleError),
    shareReplay(1)
  );

  private postCRUDSubject = new Subject<CRUDAction<IPost>>();
  postCRUDAction$ = this.postCRUDSubject.asObservable();

  allPosts$ = merge(
    this.postsWithCategory$,
    this.postCRUDAction$.pipe(map((data) => [data.data]))
  ).pipe(
    scan((posts, value) => {
      return [...posts, ...value];
    }, [] as IPost[])
  );

  addPost(post: IPost) {
    this.postCRUDSubject.next({ action: 'add', data: post });
  }

  private selectedPostSubject = new Subject<string>();
  selectedPostAction$ = this.selectedPostSubject.asObservable();

  post$ = combineLatest([
    this.postsWithCategory$,
    this.selectedPostAction$,
  ]).pipe(
    map(([posts, selectedPostId]) => {
      return posts.find((post) => post.id === selectedPostId);
    }),
    catchError(this.handleError),
    shareReplay(1)
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
