import {
  HttpErrorResponse,
  HttpEvent,
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';
import { Observable, delay, of, throwError } from 'rxjs';
import { AuthTokenPayload } from '../models/auth-token.model';
import { Comment } from '../models/comment.model';
import { Post } from '../models/post.model';
import { User, UserRole } from '../models/user.model';

type DbUser = User & { password: string };
type Db = {
  users: DbUser[];
  posts: Post[];
  comments: Comment[];
};

const DB_KEY = 'sportblog_db_v1';
const DB_VERSION = 'v3'; // Increment when schema changes (v3: using local images)
const DB_VERSION_KEY = 'sportblog_db_version';

function nowIso(): string {
  return new Date().toISOString();
}

function makeId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function seedDb(): Db {
  const admin: DbUser = {
    id: 'u_admin',
    name: 'Admin',
    email: 'admin@sportblog.com',
    role: 'admin',
    password: 'admin123',
  };
  const user: DbUser = {
    id: 'u_user',
    name: 'User',
    email: 'user@sportblog.com',
    role: 'user',
    password: 'user123',
  };

  const posts: Post[] = [
    {
      id: 'p_1',
      title: 'Training camp preview: Rookies under the radar entering Qualifiers',
      category: 'F1',
      image: '/images/f1-1.jpg',
      content:
        'As teams prepare for the upcoming qualifiers, several rookies are flying under the radar but could make significant impacts. We break down the prospects who might surprise fans and analysts alike.',
      authorId: admin.id,
      authorName: 'Gabie Sheber',
      createdAt: '2020-05-22T10:00:00Z',
    },
    {
      id: 'p_2',
      title: 'Blues must treat Qualifiers like playoffs, Allen says',
      category: 'F1',
      image: '/images/f1-2.jpg',
      content:
        'St. Louis Blues goaltender Jake Allen emphasizes the importance of treating every qualifier game with playoff intensity. The team needs to maintain focus and momentum heading into the postseason.',
      authorId: admin.id,
      authorName: 'Mike Fink',
      createdAt: '2020-03-28T14:30:00Z',
    },
    {
      id: 'p_3',
      title: 'Pronger leaving role with Panthers',
      category: 'F1',
      image: '/images/f1-1.jpg',
      content:
        'Chris Pronger is stepping down from his role with the Florida Panthers organization. The Hall of Fame defenseman has been instrumental in the team\'s front office operations.',
      authorId: admin.id,
      authorName: 'Ben Sundock',
      createdAt: '2020-03-01T09:15:00Z',
    },
    {
      id: 'p_4',
      title: 'Titans Post Elite PFF Tackling in 2019 Tackling',
      category: 'UFC',
      image: '/images/ufc1.jpg',
      content:
        'The Tennessee Titans defense showed elite tackling performance according to Pro Football Focus metrics. Their disciplined approach and fundamentals set them apart in the league.',
      authorId: admin.id,
      authorName: 'Ben Sundock',
      createdAt: '2020-03-28T11:00:00Z',
    },
    {
      id: 'p_5',
      title: 'Lakers dominate in Western Conference showdown',
      category: 'NBA',
      image: '/images/nba_1.jpg',
      content:
        'The Los Angeles Lakers put on a dominant performance in a crucial Western Conference matchup. LeBron James and Anthony Davis led the way with exceptional two-way play.',
      authorId: admin.id,
      authorName: admin.name,
      createdAt: nowIso(),
    },
    {
      id: 'p_6',
      title: 'Yankees rotation depth tested early in season',
      category: 'MLB',
      image: '/images/nba2.jpg',
      content:
        'Injuries have forced the New York Yankees to rely on their rotation depth sooner than expected. Young pitchers are stepping up to fill critical roles in the starting rotation.',
      authorId: admin.id,
      authorName: admin.name,
      createdAt: nowIso(),
    },
    {
      id: 'p_7',
      title: 'Champions League Quarterfinals Preview',
      category: 'SOCCER',
      image: '/images/soccer1.jpg',
      content:
        'The Champions League quarterfinals promise thrilling matchups. We analyze the tactical battles, key players, and what each team needs to advance to the semifinals.',
      authorId: admin.id,
      authorName: admin.name,
      createdAt: nowIso(),
    },
    {
      id: 'p_8',
      title: 'Fantasy Football: Waiver Wire Targets for Week 5',
      category: 'FANTASY',
      image: '/images/nba2.jpg',
      content:
        'With injuries mounting across the league, fantasy managers need to be proactive on the waiver wire. Here are the top targets who could provide immediate value.',
      authorId: admin.id,
      authorName: admin.name,
      createdAt: nowIso(),
    },
    {
      id: 'p_9',
      title: 'NASCAR Playoff Picture Taking Shape',
      category: 'NASCAR',
      image: '/images/nascar1.jpg',
      content:
        'As the regular season winds down, the NASCAR playoff picture is becoming clearer. Several drivers are on the bubble, making every race crucial for championship hopes.',
      authorId: admin.id,
      authorName: admin.name,
      createdAt: nowIso(),
    },
    {
      id: 'p_10',
      title: 'UFC 300 Main Event Breakdown: Title Fight Preview',
      category: 'UFC',
      image: '/images/ufc2.jpg',
      content:
        'The highly anticipated main event at UFC 300 features a championship bout that could reshape the division. We break down the fighters\' strengths, weaknesses, and what to expect in this historic matchup.',
      authorId: admin.id,
      authorName: admin.name,
      createdAt: nowIso(),
    },
    {
      id: 'p_11',
      title: 'F1 Season Opener: Verstappen Dominates in Bahrain',
      category: 'F1',
      image: '/images/f1-2.jpg',
      content:
        'Max Verstappen started the F1 season with a commanding victory in Bahrain, signaling that Red Bull remains the team to beat. Analysis of the race strategy, tire management, and what this means for the championship.',
      authorId: admin.id,
      authorName: admin.name,
      createdAt: nowIso(),
    },
    {
      id: 'p_12',
      title: 'Premier League Title Race Heats Up',
      category: 'SOCCER',
      image: '/images/soccer2.jpg',
      content:
        'With just five matches remaining, the Premier League title race is tighter than ever. Three teams are separated by just two points, making every match crucial in the final stretch of the season.',
      authorId: admin.id,
      authorName: 'Sarah Martinez',
      createdAt: '2024-04-15T10:00:00Z',
    },
    {
      id: 'p_13',
      title: 'Messi Returns to Form in MLS',
      category: 'SOCCER',
      image: '/images/soccer1.jpg',
      content:
        'Lionel Messi showed flashes of his brilliance in a dominant performance for Inter Miami. The Argentine maestro scored twice and provided an assist in a 4-1 victory that reminded fans why he\'s considered one of the greatest.',
      authorId: admin.id,
      authorName: 'David Chen',
      createdAt: '2024-04-10T14:30:00Z',
    },
    {
      id: 'p_14',
      title: 'Warriors Secure Playoff Spot with Overtime Win',
      category: 'NBA',
      image: '/images/nba2.jpg',
      content:
        'The Golden State Warriors clinched their playoff berth with a thrilling overtime victory against the Suns. Stephen Curry\'s 42-point performance, including a game-tying three-pointer at the buzzer, sealed the win.',
      authorId: admin.id,
      authorName: 'James Wilson',
      createdAt: '2024-04-12T20:15:00Z',
    },
    {
      id: 'p_15',
      title: 'Celtics Set New Franchise Record for Wins',
      category: 'NBA',
      image: '/images/nba_1.jpg',
      content:
        'The Boston Celtics achieved a franchise-record 65 wins in the regular season, cementing their status as the team to beat in the Eastern Conference. Their balanced attack and defensive intensity have been unmatched.',
      authorId: admin.id,
      authorName: 'Michael Brown',
      createdAt: '2024-04-08T16:45:00Z',
    },
    {
      id: 'p_16',
      title: 'UFC 301: Championship Doubleheader Preview',
      category: 'UFC',
      image: '/images/ufc3.jpg',
      content:
        'UFC 301 features two title fights that could reshape multiple divisions. The main event pits the lightweight champion against a rising contender, while the co-main sees a veteran defending her strawweight belt.',
      authorId: admin.id,
      authorName: 'Alex Rodriguez',
      createdAt: '2024-04-18T11:20:00Z',
    },
    {
      id: 'p_17',
      title: 'McGregor Announces Return Fight Date',
      category: 'UFC',
      image: '/images/ufc1.jpg',
      content:
        'Conor McGregor has officially announced his return to the octagon after a three-year absence. The former two-division champion will headline International Fight Week in what promises to be one of the biggest events of the year.',
      authorId: admin.id,
      authorName: 'Jessica Taylor',
      createdAt: '2024-04-14T09:00:00Z',
    },
    {
      id: 'p_18',
      title: 'Hamilton Signs Multi-Year Deal with Ferrari',
      category: 'F1',
      image: '/images/f1-1.jpg',
      content:
        'In a shocking move, seven-time world champion Lewis Hamilton will join Ferrari in 2025. The British driver leaves Mercedes after 11 seasons, creating one of the most anticipated driver pairings in F1 history.',
      authorId: admin.id,
      authorName: 'Robert Kim',
      createdAt: '2024-04-13T12:00:00Z',
    },
    {
      id: 'p_19',
      title: 'Dodgers Extend Win Streak to 12 Games',
      category: 'MLB',
      image: '/images/nba2.jpg',
      content:
        'The Los Angeles Dodgers continue their dominant start to the season, extending their winning streak to 12 games. Their offense has been firing on all cylinders, averaging over 6 runs per game during the streak.',
      authorId: admin.id,
      authorName: 'Emily Davis',
      createdAt: '2024-04-16T18:30:00Z',
    },
    {
      id: 'p_20',
      title: 'Ohtani Hits 50th Home Run of Season',
      category: 'MLB',
      image: '/images/nba_1.jpg',
      content:
        'Shohei Ohtani reached the 50-home run milestone in record time, becoming the fastest player to achieve this feat in MLB history. The two-way superstar continues to rewrite the record books.',
      authorId: admin.id,
      authorName: 'Chris Anderson',
      createdAt: '2024-04-11T15:00:00Z',
    },
    {
      id: 'p_21',
      title: 'Fantasy Baseball: Waiver Wire Gems for Week 6',
      category: 'FANTASY',
      image: '/images/nascar1.jpg',
      content:
        'With injuries mounting and underperformers being dropped, the waiver wire is loaded with potential. We identify five players who could provide immediate value and help turn your season around.',
      authorId: admin.id,
      authorName: 'Ryan Thompson',
      createdAt: '2024-04-17T10:45:00Z',
    },
    {
      id: 'p_22',
      title: 'NASCAR Playoffs: Round of 8 Preview',
      category: 'NASCAR',
      image: '/images/nascar1.jpg',
      content:
        'The NASCAR playoffs enter the Round of 8, where four drivers will be eliminated. The remaining contenders face three challenging tracks that will test every aspect of their racing ability.',
      authorId: admin.id,
      authorName: 'Patricia Lee',
      createdAt: '2024-04-19T13:15:00Z',
    },
  ];

  const comments: Comment[] = [
    {
      id: 'c_1',
      postId: 'p_1',
      userId: user.id,
      userName: user.name,
      text: 'Loved the recap — that final drive was unreal.',
      createdAt: nowIso(),
    },
  ];

  return { users: [admin, user], posts, comments };
}

function loadDb(): Db {
  try {
    const storedVersion = localStorage.getItem(DB_VERSION_KEY);
    const raw = localStorage.getItem(DB_KEY);
    
    // If no data or version mismatch, reseed
    if (!raw || storedVersion !== DB_VERSION) {
      const seeded = seedDb();
      localStorage.setItem(DB_KEY, JSON.stringify(seeded));
      localStorage.setItem(DB_VERSION_KEY, DB_VERSION);
      return seeded;
    }
    
    return JSON.parse(raw) as Db;
  } catch {
    const seeded = seedDb();
    localStorage.setItem(DB_KEY, JSON.stringify(seeded));
    localStorage.setItem(DB_VERSION_KEY, DB_VERSION);
    return seeded;
  }
}

function saveDb(db: Db): void {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function decodeToken(token: string): AuthTokenPayload | null {
  try {
    return JSON.parse(atob(token)) as AuthTokenPayload;
  } catch {
    return null;
  }
}

function bearerPayload(authorization: string | null): AuthTokenPayload | null {
  if (!authorization) return null;
  const m = authorization.match(/^Bearer\s+(.+)$/i);
  if (!m) return null;
  return decodeToken(m[1]);
}

function tokenForUser(u: User): string {
  const payload: AuthTokenPayload = {
    userId: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    iat: Date.now(),
  };
  return btoa(JSON.stringify(payload));
}

function ok<T>(body: T, status = 200): HttpResponse<T> {
  return new HttpResponse({ status, body });
}

function error(status: number, message: string): Observable<never> {
  return throwError(
    () =>
      new HttpErrorResponse({
        status,
        statusText: message,
        error: { message },
      }),
  );
}

function withoutPassword(u: DbUser): User {
  const { password, ...rest } = u;
  void password;
  return rest;
}

function isAdminRole(role: UserRole | undefined): boolean {
  return role === 'admin';
}

export const mockApiInterceptor: HttpInterceptorFn = (req, next): Observable<HttpEvent<unknown>> => {
  if (!req.url.startsWith('/api/')) return next(req);

  const db = loadDb();
  const method = req.method.toUpperCase();
  const auth = bearerPayload(req.headers.get('Authorization'));

  // Best-effort JSON parsing
  const body: any = req.body ?? {};

  // Parse URL (works even if relative)
  const url = new URL(req.url, 'http://localhost');
  const path = url.pathname; // e.g. /api/posts/123

  // AUTH
  if (method === 'POST' && path === '/api/auth/login') {
    const { email, password } = body as { email?: string; password?: string };
    const found = db.users.find((u) => u.email.toLowerCase() === String(email ?? '').toLowerCase());
    if (!found || found.password !== password) {
      return error(401, 'Invalid email or password');
    }
    const user = withoutPassword(found);
    const token = tokenForUser(user);
    return of(ok({ token, user })).pipe(delay(200));
  }

  if (method === 'POST' && path === '/api/auth/register') {
    const { name, email, password } = body as { name?: string; email?: string; password?: string };
    if (!name || !email || !password) return error(400, 'Missing required fields');
    const exists = db.users.some((u) => u.email.toLowerCase() === String(email).toLowerCase());
    if (exists) return error(409, 'Email already exists');

    const newUser: DbUser = {
      id: makeId('u'),
      name: String(name),
      email: String(email),
      role: 'user',
      password: String(password),
    };
    db.users.push(newUser);
    saveDb(db);

    const user = withoutPassword(newUser);
    const token = tokenForUser(user);
    return of(ok({ token, user }, 201)).pipe(delay(200));
  }

  // POSTS
  if (method === 'GET' && path === '/api/posts') {
    let posts = [...db.posts].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const category = url.searchParams.get('category');
    const authorId = url.searchParams.get('authorId');
    if (category) {
      posts = posts.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    if (authorId) {
      posts = posts.filter((p) => p.authorId === authorId);
    }
    return of(ok(posts)).pipe(delay(150));
  }

  const postIdMatch = path.match(/^\/api\/posts\/(.+)$/);
  if (method === 'GET' && postIdMatch) {
    const id = decodeURIComponent(postIdMatch[1]);
    const post = db.posts.find((p) => p.id === id);
    if (!post) return error(404, 'Post not found');
    return of(ok(post)).pipe(delay(150));
  }

  if (method === 'POST' && path === '/api/posts') {
    if (!isAdminRole(auth?.role)) return error(403, 'Admin only');
    const { title, content, image, category } = body as Partial<Post>;
    if (!title || !content || !image || !category) return error(400, 'Missing required fields');

    const post: Post = {
      id: makeId('p'),
      title: String(title),
      content: String(content),
      image: String(image),
      category: String(category),
      authorId: auth!.userId,
      authorName: auth!.name,
      createdAt: nowIso(),
    };
    db.posts.unshift(post);
    saveDb(db);
    return of(ok(post, 201)).pipe(delay(200));
  }

  if (method === 'PUT' && postIdMatch) {
    if (!isAdminRole(auth?.role)) return error(403, 'Admin only');
    const id = decodeURIComponent(postIdMatch[1]);
    const idx = db.posts.findIndex((p) => p.id === id);
    if (idx < 0) return error(404, 'Post not found');

    const existing = db.posts[idx];
    const nextPost: Post = {
      ...existing,
      title: body.title ?? existing.title,
      content: body.content ?? existing.content,
      image: body.image ?? existing.image,
      category: body.category ?? existing.category,
    };
    db.posts[idx] = nextPost;
    saveDb(db);
    return of(ok(nextPost)).pipe(delay(200));
  }

  if (method === 'DELETE' && postIdMatch) {
    if (!isAdminRole(auth?.role)) return error(403, 'Admin only');
    const id = decodeURIComponent(postIdMatch[1]);
    const before = db.posts.length;
    db.posts = db.posts.filter((p) => p.id !== id);
    db.comments = db.comments.filter((c) => c.postId !== id);
    if (db.posts.length === before) return error(404, 'Post not found');
    saveDb(db);
    return of(ok(undefined as any, 204)).pipe(delay(150));
  }

  // USERS
  const userIdMatch = path.match(/^\/api\/users\/(.+)$/);
  if (method === 'GET' && userIdMatch) {
    const id = decodeURIComponent(userIdMatch[1]);
    const found = db.users.find((u) => u.id === id);
    if (!found) return error(404, 'User not found');
    return of(ok(withoutPassword(found))).pipe(delay(150));
  }

  // COMMENTS
  if (method === 'GET' && path === '/api/comments') {
    const postId = url.searchParams.get('postId');
    if (!postId) return error(400, 'postId is required');
    const comments = db.comments
      .filter((c) => c.postId === postId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    return of(ok(comments)).pipe(delay(150));
  }

  if (method === 'POST' && path === '/api/comments') {
    if (!auth) return error(401, 'Login required');
    const { postId, text } = body as { postId?: string; text?: string };
    if (!postId || !text) return error(400, 'Missing required fields');
    const postExists = db.posts.some((p) => p.id === postId);
    if (!postExists) return error(404, 'Post not found');

    const comment: Comment = {
      id: makeId('c'),
      postId: String(postId),
      userId: auth.userId,
      userName: auth.name,
      text: String(text),
      createdAt: nowIso(),
    };
    db.comments.push(comment);
    saveDb(db);
    return of(ok(comment, 201)).pipe(delay(200));
  }

  return error(404, 'Unknown API route');
};

