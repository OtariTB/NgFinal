import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { combineLatest, filter, map, shareReplay, startWith, Subject, switchMap, tap } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CommentService } from '../../services/comment.service';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-details-page',
  standalone: true,
  imports: [AsyncPipe, DatePipe, ReactiveFormsModule, RouterLink],
  templateUrl: './post-details-page.component.html',
  styleUrl: './post-details-page.component.css',
})
export class PostDetailsPageComponent {
  private readonly reloadComments$ = new Subject<void>();
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly posts = inject(PostService);
  private readonly comments = inject(CommentService);

  readonly postId$ = this.route.paramMap.pipe(
    map((p) => p.get('id')),
    filter((id): id is string => !!id),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly post$ = this.postId$.pipe(
    switchMap((id) => this.posts.getPost(id)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly comments$ = combineLatest([
    this.postId$,
    this.reloadComments$.pipe(startWith(undefined)),
  ]).pipe(
    switchMap(([id]) => this.comments.getCommentsByPost(id)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly user$ = this.auth.user$;

  readonly commentForm = new FormGroup({
    text: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
  });

  isSubmitting = false;
  errorMsg = '';

  submitComment(postId: string): void {
    if (!this.auth.isLoggedIn) return;
    if (this.commentForm.invalid) {
      this.commentForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMsg = '';

    const text = this.commentForm.controls.text.value;
    this.comments
      .addComment(postId, text)
      .pipe(
        tap({
          next: () => {
            this.commentForm.reset({ text: '' });
            this.reloadComments$.next();
          },
          error: (err) => {
            this.errorMsg = err?.error?.message ?? 'Failed to add comment';
          },
        }),
      )
      .subscribe({
        complete: () => (this.isSubmitting = false),
        error: () => (this.isSubmitting = false),
      });
  }
}

