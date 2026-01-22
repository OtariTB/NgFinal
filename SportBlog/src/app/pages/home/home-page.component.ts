import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { PostService } from '../../services/post.service';
import { PostCardComponent } from '../../components/post-card/post-card.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [AsyncPipe, PostCardComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  private readonly posts = inject(PostService);
  readonly posts$ = this.posts.getPosts();
}

