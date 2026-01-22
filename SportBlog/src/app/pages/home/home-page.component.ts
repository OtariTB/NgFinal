import { AsyncPipe, DatePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { map, shareReplay } from 'rxjs';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [AsyncPipe, DatePipe, RouterLink],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent implements AfterViewInit {
  private readonly posts = inject(PostService);
  
  @ViewChild('highlightsScroll', { static: false }) highlightsScroll!: ElementRef<HTMLDivElement>;
  @ViewChild('highlightsContainer', { static: false }) highlightsContainer!: ElementRef<HTMLDivElement>;
  
  readonly allPosts$ = this.posts.getPosts().pipe(
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly featuredPost$ = this.allPosts$.pipe(
    map((posts) => posts[0] ?? null),
  );

  readonly otherPosts$ = this.allPosts$.pipe(
    map((posts) => posts.slice(1, 4)), // Show next 3 posts on the right
  );

  readonly highlightsPosts$ = this.allPosts$.pipe(
    map((posts) => posts.slice(4, 10)), // Show next 6 posts in highlights section
  );

  readonly gridPosts$ = this.allPosts$.pipe(
    map((posts) => posts.slice(10)), // Show remaining posts in grid section
  );

  canScrollLeft = false;
  canScrollRight = true;
  currentPage = 0;
  totalPages = 0;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updateScrollState();
      this.calculatePages();
    }, 100);
  }

  scrollLeft(): void {
    if (this.highlightsScroll) {
      const scrollContainer = this.highlightsScroll.nativeElement;
      const cardWidth = 300 + 24; // card width + gap
      scrollContainer.scrollBy({ left: -cardWidth * 3, behavior: 'smooth' });
      setTimeout(() => this.updateScrollState(), 300);
    }
  }

  scrollRight(): void {
    if (this.highlightsScroll) {
      const scrollContainer = this.highlightsScroll.nativeElement;
      const cardWidth = 300 + 24; // card width + gap
      scrollContainer.scrollBy({ left: cardWidth * 3, behavior: 'smooth' });
      setTimeout(() => this.updateScrollState(), 300);
    }
  }

  scrollToPage(page: number): void {
    if (this.highlightsScroll && this.highlightsContainer) {
      const scrollContainer = this.highlightsScroll.nativeElement;
      const container = this.highlightsContainer.nativeElement;
      const cardWidth = 300 + 24; // card width + gap
      const cardsPerPage = Math.floor(scrollContainer.clientWidth / cardWidth);
      const scrollPosition = page * cardsPerPage * cardWidth;
      scrollContainer.scrollTo({ left: scrollPosition, behavior: 'smooth' });
      setTimeout(() => this.updateScrollState(), 300);
    }
  }

  onScroll(): void {
    this.updateScrollState();
    this.updateCurrentPage();
  }

  private updateScrollState(): void {
    if (!this.highlightsScroll) return;
    const scrollContainer = this.highlightsScroll.nativeElement;
    this.canScrollLeft = scrollContainer.scrollLeft > 0;
    this.canScrollRight = 
      scrollContainer.scrollLeft < scrollContainer.scrollWidth - scrollContainer.clientWidth - 10;
  }

  private calculatePages(): void {
    if (!this.highlightsScroll || !this.highlightsContainer) return;
    const scrollContainer = this.highlightsScroll.nativeElement;
    const container = this.highlightsContainer.nativeElement;
    const cardWidth = 300 + 24; // card width + gap
    const cardsPerPage = Math.floor(scrollContainer.clientWidth / cardWidth);
    const totalCards = container.children.length;
    this.totalPages = Math.ceil(totalCards / cardsPerPage);
  }

  private updateCurrentPage(): void {
    if (!this.highlightsScroll) return;
    const scrollContainer = this.highlightsScroll.nativeElement;
    const cardWidth = 300 + 24; // card width + gap
    const cardsPerPage = Math.floor(scrollContainer.clientWidth / cardWidth);
    this.currentPage = Math.round(scrollContainer.scrollLeft / (cardWidth * cardsPerPage));
  }

  getPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }
}

