import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeclarativePostsComponent } from 'src/app/pages/declarative-posts/declarative-posts.component';
import { HomeComponent } from 'src/app/pages/home/home.component';
import { PostsComponent } from 'src/app/pages/posts/posts.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'posts',
    component: PostsComponent,
  },
  {
    path: 'declarativeposts',
    component: DeclarativePostsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
