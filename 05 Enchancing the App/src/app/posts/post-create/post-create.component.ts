import { Component, inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, convertToParamMap, ParamMap } from '@angular/router';
import { Post } from '../post.model';
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.css',
})
export class PostCreateComponent implements OnInit {
  enteredTitle = "";
  enteredContent = "";
  private mode = 'create';
  private postId: string;
  post: Post;
  isLoading = false;
  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData=>{
          this.isLoading = false;
          this.post = {id: postData._id, title: postData.title, content: postData.content}; 
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  // constructor(public postsService: PostsService, public route: ActivatedRoute) { }{

  // } you can either use this constructor method or below inject method,

  public postsService = inject(PostsService)
  public route = inject(ActivatedRoute)

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading=true;
    if(this.mode === 'create') {
      this.postsService.addPost(form.value.title, form.value.content);
    }else{
      this.postsService.updatePost(this.postId, form.value.title, form.value.content);
    }

    form.resetForm();
  }
}
