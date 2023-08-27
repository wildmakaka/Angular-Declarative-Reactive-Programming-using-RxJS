import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map } from 'rxjs';
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
      map((posts) => {
        let postsData: IPost[] = [];
        for (let id in posts) {
          postsData.push({ ...posts[id], id });
        }
        return postsData;
      })
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
    })
  );

  constructor(
    private http: HttpClient,
    private categoryService: DeclarativeCategoryService
  ) {}
} // The End of Class;
