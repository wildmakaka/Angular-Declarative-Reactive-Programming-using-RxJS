import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DeclarativeCategoryService } from 'src/app/services/DeclarativeCategory.service';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPostComponent {
  postForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    categoryId: new FormControl(''),
  });

  categories$ = this.categoryService.categories$;

  constructor(private categoryService: DeclarativeCategoryService) {}

  onAddPost() {
    console.log(this.postForm.value);
  }
} // The End of Class;
