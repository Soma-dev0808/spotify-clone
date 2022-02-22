import NextAuth, { Account, User } from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';
import spotifyApi, { LOGIN_URL } from '../../../utilities/spotify';
import type { CustomJWT, CustomSession } from '../../../utilities/spotify';
import { checkNullOrUndefined } from '../../../utilities/utilities';

const refreshAccessToken = async (token: CustomJWT): Promise<CustomJWT> => {
  try {
    // Check if token has both accessToken and refreshToken.
    if (
      checkNullOrUndefined(token.accessToken) &&
      checkNullOrUndefined(token.refreshToken)
    ) {
      spotifyApi.setAccessToken(token.accessToken!);
      spotifyApi.setRefreshToken(token.refreshToken!);
    }

    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();

    console.log('refreshedToken', refreshedToken);

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.log(error);
    return {
      ...token,
      error: 'Refresh token error',
    };
  }
};

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET!,
      authorization: LOGIN_URL,
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({
      token,
      account,
      user,
    }: {
      token: CustomJWT;
      user?: User | undefined;
      account?: Account | undefined;
    }): Promise<CustomJWT> {
      // initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at! * 1000, // Milliseconds hence * 1000
        };
      }

      // Return previous token if the access token is not expired yet
      const expires = token.accessTokenExpires;
      if (checkNullOrUndefined(expires) && Date.now() < expires!) {
        console.log('Access token is not expired');
        return token;
      }

      // Access token has expired, so we need to refresh it.
      return await refreshAccessToken(token);
    },
    async session({
      session,
      token,
    }: {
      session: CustomSession;
      token: CustomJWT;
    }) {
      if (session.user) {
        session.user.accessToken = token.accessToken;
        session.user.refreshToken = token.refreshToken;
        session.user.username = token.username;
      } else {
        throw Error('Server Error: session has no user info.');
      }

      return session;
    },
  },
});
