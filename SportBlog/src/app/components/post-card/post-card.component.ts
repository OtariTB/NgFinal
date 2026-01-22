import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Post } from '../../models/post.model';
import { TruncatePipe } from '../../pipes/truncate.pipe';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [DatePipe, RouterLink, TruncatePipe],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css',
})
export class PostCardComponent {
  @Input({ required: true }) post!: Post;
}

