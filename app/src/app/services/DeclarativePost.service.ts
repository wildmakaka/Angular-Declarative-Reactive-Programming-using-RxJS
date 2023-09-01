import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Observable,
  Subject,
  catchError,
  combineLatest,
  concatMap,
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
    this.postCRUDAction$.pipe(
      concatMap((postAction) =>
        this.savePosts(postAction).pipe(
          map((post) => ({ ...postAction, data: post }))
        )
      )
    )
  ).pipe(
    scan((posts, value) => {
      return this.modifyPosts(posts, value);
    }, [] as IPost[]),
    shareReplay(1)
  );

  constructor(
    private http: HttpClient,
    private categoryService: DeclarativeCategoryService
  ) {}

  modifyPosts(posts: IPost[], value: IPost[] | CRUDAction<IPost>) {
    if (!(value instanceof Array)) {
      if (value.action === 'add') {
        return [...posts, value.data];
      }
      if (value.action === 'update') {
        return posts.map((post) =>
          post.id === value.data.id ? value.data : post
        );
      }
      if (value.action === 'delete') {
        return posts.filter((post) => post.id !== value.data.id);
      }
    } else {
      return value;
    }

    return posts;
  }

  savePosts(postAction: CRUDAction<IPost>) {
    let postDetails$!: Observable<IPost>;

    if (postAction.action === 'add') {
      postDetails$ = this.addPostToServer(postAction.data);
    }
    if (postAction.action === 'update') {
      postDetails$ = this.updatePostToServer(postAction.data);
    }

    if (postAction.action === 'delete') {
      return (postDetails$ = this.deletePostToServer(postAction.data).pipe(
        map((post) => postAction.data)
      ));
    }

    return postDetails$.pipe(
      concatMap((post) =>
        this.categoryService.categories$.pipe(
          map((categories) => {
            return {
              ...post,
              categoryName: categories.find(
                (category) => category.id === post.categoryId
              )?.title,
            };
          })
        )
      )
    );
  }

  addPostToServer(post: IPost) {
    return this.http
      .post<{ name: string }>(
        `https://rxjs-posts-default-rtdb.firebaseio.com/posts.json`,
        post
      )
      .pipe(
        map((id) => {
          return {
            ...post,
            id: id.name,
          };
        })
      );
  }

  updatePostToServer(post: IPost) {
    return this.http.patch<IPost>(
      `https://rxjs-posts-default-rtdb.firebaseio.com/posts/${post.id}.json`,
      post
    );
  }

  deletePostToServer(post: IPost) {
    return this.http.delete(
      `https://rxjs-posts-default-rtdb.firebaseio.com/posts/${post.id}.json`
    );
  }

  addPost(post: IPost) {
    this.postCRUDSubject.next({ action: 'add', data: post });
  }

  updatePost(post: IPost) {
    this.postCRUDSubject.next({ action: 'update', data: post });
  }

  deletePost(post: IPost) {
    this.postCRUDSubject.next({ action: 'delete', data: post });
  }

  private selectedPostSubject = new Subject<string>();
  selectedPostAction$ = this.selectedPostSubject.asObservable();

  post$ = combineLatest([this.allPosts$, this.selectedPostAction$]).pipe(
    map(([posts, selectedPostId]) => {
      return posts.find((post) => post.id === selectedPostId);
    }),
    catchError(this.handleError),
    shareReplay(1)
  );

  selectPost(postId: string) {
    this.selectedPostSubject.next(postId);
  }

  handleError(error: Error) {
    return throwError(() => {
      return 'Unknown error occurred! Please try again!';
    });
  }
} // The End of Class;
