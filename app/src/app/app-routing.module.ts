import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostFormComponent } from 'src/app/components/post-form/post-form.component';
import { AltPostsComponent } from 'src/app/pages/alt-posts/alt-posts.component';
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
  {
    path: 'declarativeposts/add',
    component: PostFormComponent,
  },
  {
    path: 'declarativeposts/edit/:id',
    component: PostFormComponent,
  },
  {
    path: 'altposts',
    component: AltPostsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
