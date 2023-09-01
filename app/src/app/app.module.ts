import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddPostComponent } from './components/add-post/add-post.component';
import { HeaderComponent } from './components/header/header.component';
import { LoadingComponent } from './components/loading/loading.component';
import { SinglePostComponent } from './components/single-post/single-post.component';
import { AltPostsComponent } from './pages/alt-posts/alt-posts.component';
import { DeclarativePostsComponent } from './pages/declarative-posts/declarative-posts.component';
import { HomeComponent } from './pages/home/home.component';
import { PostsComponent } from './pages/posts/posts.component';
import { UpdatePostComponent } from './components/update-post/update-post.component';
import { PostFormComponent } from './components/post-form/post-form.component';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  declarations: [
    AppComponent,
    HeaderComponent,
    PostsComponent,
    HomeComponent,
    DeclarativePostsComponent,
    AltPostsComponent,
    SinglePostComponent,
    LoadingComponent,
    AddPostComponent,
    UpdatePostComponent,
    PostFormComponent,
  ],

  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
