import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { shareReplay, startWith, Subject, switchMap } from 'rxjs';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule],
  templateUrl: './admin-dashboard-page.component.html',
  styleUrl: './admin-dashboard-page.component.css',
})
export class AdminDashboardPageComponent {
  private readonly reload$ = new Subject<void>();

  readonly posts$ = this.reload$.pipe(
    startWith(undefined),
    switchMap(() => this.posts.getPosts()),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  editingId: string | null = null;
  isSaving = false;
  errorMsg = '';

  readonly form = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    category: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    image: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    content: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(10)] }),
  });

  constructor(private readonly posts: PostService) {}

  startCreate(): void {
    this.editingId = null;
    this.errorMsg = '';
    this.form.reset({ title: '', category: '', image: '', content: '' });
  }

  startEdit(post: Post): void {
    this.editingId = post.id;
    this.errorMsg = '';
    this.form.reset({
      title: post.title,
      category: post.category,
      image: post.image,
      content: post.content,
    });
  }

  cancelEdit(): void {
    this.startCreate();
  }

  save(): void {
    this.errorMsg = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const payload = this.form.getRawValue();

    const req$ = this.editingId
      ? this.posts.updatePost(this.editingId, payload)
      : this.posts.createPost(payload);

    req$.subscribe({
      next: () => {
        this.startCreate();
        this.reload$.next();
      },
      error: (err) => {
        this.errorMsg = err?.error?.message ?? 'Save failed';
        this.isSaving = false;
      },
      complete: () => (this.isSaving = false),
    });
  }

  delete(post: Post): void {
    const ok = confirm(`Delete "${post.title}"?`);
    if (!ok) return;

    this.posts.deletePost(post.id).subscribe({
      next: () => this.reload$.next(),
      error: (err) => (this.errorMsg = err?.error?.message ?? 'Delete failed'),
    });
  }
}

