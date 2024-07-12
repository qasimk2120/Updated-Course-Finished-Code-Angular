import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsSub :Subscription;
  isLoading :boolean = false;
  // constructor(public postsService: PostsService) {
    
  // }
  public postsService = inject(PostsService);
  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateListener()
    .subscribe((posts: Post[]) => {
      this.posts = posts;
      this.isLoading=false;
    });
  }
  onDelete(postId: string){
    this.postsService.onDelete(postId);
  }


  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }

}
