import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for static files and SEO files
  if (
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/site.webmanifest' ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.svg')
  ) {
    return NextResponse.next();
  }

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/signup', '/forgot-password', '/reset-password', '/showcase', '/privacy', '/terms', '/about', '/contact', '/journalist'];
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith('/showcase/') || pathname.startsWith('/journalist/')
  );

  // API routes handle their own auth
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // If Supabase isn't configured, allow public routes
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    if (isPublicRoute) {
      return NextResponse.next();
    }
    // Redirect to login for protected routes when Supabase isn't configured
    return NextResponse.redirect(new URL('/login', request.url));
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Try to get session, but allow public routes even if Supabase fails
  let session = null;
  try {
    const { data } = await supabase.auth.getSession();
    session = data.session;
  } catch (error) {
    // Supabase connection failed - allow public routes
    if (isPublicRoute) {
      return response;
    }
    // For protected routes, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user is not logged in and trying to access protected route
  if (!session && !isPublicRoute) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If user is logged in and trying to access auth pages
  if (session && (pathname === '/login' || pathname === '/signup')) {
    // Check role to redirect to appropriate dashboard
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role === 'admin') {
      return NextResponse.redirect(new URL('/admin/requests', request.url));
    }
    return NextResponse.redirect(new URL('/dashboard/my-releases', request.url));
  }

  // Admin route protection
  if (pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard/my-releases', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match paths that need auth checking.
     * Explicitly list protected paths instead of excluding static files.
     */
    '/',
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/dashboard/:path*',
    '/admin/:path*',
    '/showcase/:path*',
    '/journalist/:path*',
    '/privacy',
    '/terms',
    '/about',
    '/contact',
  ],
};
