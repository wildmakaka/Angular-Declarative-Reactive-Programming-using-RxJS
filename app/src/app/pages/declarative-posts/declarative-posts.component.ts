import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DeclarativePostService } from 'src/app/services/DeclaritivePost.service';

@Component({
  selector: 'app-declarative-posts',
  templateUrl: './declarative-posts.component.html',
  styleUrls: ['./declarative-posts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeclarativePostsComponent {
  posts$ = this.postService.posts$;

  constructor(private postService: DeclarativePostService) {}
}
