import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DeclarativeCategoryService } from 'src/app/services/DeclarativeCategory.service';

@Component({
  selector: 'app-update-post',
  templateUrl: './update-post.component.html',
  styleUrls: ['./update-post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatePostComponent {
  categories$ = this.categoryService.categories$;

  constructor(private categoryService: DeclarativeCategoryService) {}
}
