import { Injectable, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from './post.model';
import { HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private http = inject(HttpClient)
  private router = inject(Router)
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  getPosts() {
    this.http.get<{ message: string, posts: any }>('http://localhost:3000/api/posts')
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          }
        })
      }))
      .subscribe((tranformedPosts) => {
        this.posts = tranformedPosts
        this.postsUpdated.next([...this.posts])
      })
  }
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.http.post<{ message: string, postId: string }>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        const id = responseData.postId
        post.id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      })
  }
  getPost(id: string) {
    return this.http.get<{_id:string, title:string, content:string}>("http://localhost:3000/api/posts/" + id)
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = { id: id, title: title, content: content };
    this.http.put('http://localhost:3000/api/posts/' + id, post).subscribe(response => {
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(['/']);

    })
  }
  onDelete(postId: string) {
    this.http.delete<{ message: string }>('http://localhost:3000/api/posts/' + postId)
      .subscribe((responseData) => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts
        this.postsUpdated.next([...this.posts])
        console.log(responseData.message)
      })
  }
}
