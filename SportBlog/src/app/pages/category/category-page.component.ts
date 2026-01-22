import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, shareReplay, switchMap } from 'rxjs';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-category-page',
  standalone: true,
  imports: [AsyncPipe, DatePipe, RouterLink],
  templateUrl: './category-page.component.html',
  styleUrl: './category-page.component.css',
})
export class CategoryPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly posts = inject(PostService);

  readonly category$ = this.route.paramMap.pipe(
    map((p) => p.get('category') ?? ''),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly posts$ = this.category$.pipe(
    switchMap((cat) => this.posts.getPostsByCategory(cat)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly featuredPost$ = this.posts$.pipe(
    map((posts) => posts[0] ?? null),
  );

  readonly otherPosts$ = this.posts$.pipe(
    map((posts) => posts.slice(1)),
  );

  getCategoryDisplayName(category: string): string {
    return category.toUpperCase();
  }

  getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      NBA: '#C8102E',
      UFC: '#D20A0A',
      F1: '#E10600',
      MLB: '#132448',
      SOCCER: '#00A859',
      FANTASY: '#FF6B35',
      NASCAR: '#FFD700',
    };
    return colors[category.toUpperCase()] ?? '#00A859';
  }
}
