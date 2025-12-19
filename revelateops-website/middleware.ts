import { auth } from "@/auth"

export default auth((req) => {
  const { pathname } = req.nextUrl

  // Protect all /admin routes
  if (pathname.startsWith('/admin')) {
    if (!req.auth) {
      const signInUrl = new URL('/taskflow/login', req.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return Response.redirect(signInUrl)
    }
  }

  // TODO: Re-enable when Google OAuth is configured
  // Protect all /taskflow routes (except /taskflow/login)
  // if (pathname.startsWith('/taskflow') && !pathname.startsWith('/taskflow/login')) {
  //   if (!req.auth) {
  //     const signInUrl = new URL('/taskflow/login', req.url)
  //     signInUrl.searchParams.set('callbackUrl', pathname)
  //     return Response.redirect(signInUrl)
  //   }
  // }

  // Protect all /api/taskflow routes
  // if (pathname.startsWith('/api/taskflow')) {
  //   if (!req.auth) {
  //     return new Response(JSON.stringify({ error: 'Unauthorized' }), {
  //       status: 401,
  //       headers: { 'Content-Type': 'application/json' }
  //     })
  //   }
  // }
})

export const config = {
  matcher: ['/admin/:path*', '/taskflow/:path*', '/api/taskflow/:path*'],
}
