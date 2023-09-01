import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, map, tap } from 'rxjs';
import { DeclarativeCategoryService } from 'src/app/services/DeclarativeCategory.service';
import { DeclarativePostService } from 'src/app/services/DeclarativePost.service';
import { LoaderService } from 'src/app/services/Loader.service';

@Component({
  selector: 'app-declarative-posts',
  templateUrl: './declarative-posts.component.html',
  styleUrls: ['./declarative-posts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeclarativePostsComponent implements OnInit {
  selectedCategorySubject = new BehaviorSubject<string>('');
  selectedCategoryAction$ = this.selectedCategorySubject.asObservable();

  posts$ = this.postService.allPosts$;
  categories$ = this.categoryService.categories$;
  selectedCategoryId = '';

  filteredPosts$ = combineLatest([
    this.posts$,
    this.selectedCategoryAction$,
  ]).pipe(
    tap((data) => {
      this.loaderService.hideloader();
    }),
    map(([posts, selectedCategoryId]) => {
      return posts.filter((post) =>
        selectedCategoryId ? post.categoryId === selectedCategoryId : true
      );
    })
  );

  constructor(
    private postService: DeclarativePostService,
    private categoryService: DeclarativeCategoryService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.loaderService.showLoader();
  }

  onCategoryChange(event: Event) {
    let selectedCategoryId = (event.target as HTMLSelectElement).value;
    this.selectedCategorySubject.next(selectedCategoryId);
  }
} // The End of Class;
