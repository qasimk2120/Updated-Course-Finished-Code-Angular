import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsSub :Subscription;
  isLoading :boolean = false;
  totalPosts=0;
  postsPerPage =2;
  currentPage = 1;
  pageSizeOptions = [1, 2 , 5, 10];
  // constructor(public postsService: PostsService) {
    
  // }
  public postsService = inject(PostsService);
  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage,this.currentPage);
    this.postsSub = this.postsService.getPostUpdateListener()
    .subscribe((postData: {posts: Post[], postCount:number}) => {
      this.isLoading=false;
      this.totalPosts= postData.postCount
      this.posts = postData.posts;
    });
  }
  onChangedPage(pageData: PageEvent){
    this.isLoading=true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize; 
    this.postsService.getPosts(this.postsPerPage,this.currentPage);
  }
  onDelete(postId: string){
    this.isLoading=true;
    this.postsService.onDelete(postId).subscribe(()=>{
      this.postsService.getPosts(this.postsPerPage,this.currentPage);
    });
  }


  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }

}
