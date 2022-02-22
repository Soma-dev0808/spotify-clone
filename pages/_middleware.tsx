import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextApiRequest } from 'next';
import type { NextRequest } from 'next/server';

export const middleware = async (
  req: NextApiRequest & NextRequest
): Promise<NextResponse | undefined> => {
  const token = await getToken({ req, secret: process.env.JWT_SECRET! });

  const { pathname } = req.nextUrl;

  // Allow the requests if the following is true
  if (pathname.includes('/api/auth') || token) {
    // If token exists or access path is '/api/auth', it will allow to access the requested path.
    return NextResponse.next();
  }

  if (!token && pathname !== '/login') {
    const newUrl = req.nextUrl.clone();
    newUrl.pathname = '/login';
    return NextResponse.redirect(newUrl);
  }
};
