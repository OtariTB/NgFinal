import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { combineLatest, map, switchMap } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { PostService } from '../../services/post.service';
import { PostCardComponent } from '../../components/post-card/post-card.component';

@Component({
  selector: 'app-user-profile-page',
  standalone: true,
  imports: [AsyncPipe, RouterLink, PostCardComponent],
  templateUrl: './user-profile-page.component.html',
  styleUrl: './user-profile-page.component.css',
})
export class UserProfilePageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly auth = inject(AuthService);
  private readonly posts = inject(PostService);

  readonly userId$ = this.route.paramMap.pipe(
    map((params) => params.get('id') ?? ''),
  );

  readonly user$ = this.userId$.pipe(
    switchMap((id) => this.auth.getUser(id)),
  );

  readonly userPosts$ = this.userId$.pipe(
    switchMap((id) => this.posts.getPostsByAuthor(id)),
  );

  readonly vm$ = combineLatest([this.user$, this.userPosts$]).pipe(
    map(([user, posts]) => ({ user, posts })),
  );
}
