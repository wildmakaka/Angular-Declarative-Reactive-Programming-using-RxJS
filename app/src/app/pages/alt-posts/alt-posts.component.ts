import { ChangeDetectionStrategy, Component } from '@angular/core';
import { combineLatest, map, tap } from 'rxjs';
import { IPost } from 'src/app/models/IPost';
import { DeclarativePostService } from 'src/app/services/DeclarativePost.service';

@Component({
  selector: 'app-alt-posts',
  templateUrl: './alt-posts.component.html',
  styleUrls: ['./alt-posts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AltPostsComponent {
  showAddPost = false;
  posts$ = this.postService.postsWithCategory$.pipe(
    tap((posts) => {
      posts[0].id && this.postService.selectPost(posts[0].id);
    })
  );
  selectedPost$ = this.postService.post$.pipe(tap((data) => {}));

  vm$ = combineLatest([this.posts$, this.selectedPost$]).pipe(
    map(([posts, selectedPost]) => {
      return { posts, selectedPost };
    })
  );

  constructor(private postService: DeclarativePostService) {}

  onSelectPost(post: IPost, event: Event) {
    event.preventDefault();

    post.id && this.postService.selectPost(post.id);
  }

  onAddPost() {
    this.showAddPost = true;
  }
} // The End of Class;
