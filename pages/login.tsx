import {
  ClientSafeProvider,
  getProviders,
  LiteralUnion,
  signIn,
} from 'next-auth/react';
import { BuiltInProviderType } from 'next-auth/providers';

type NextAuthProvidersType = Record<
  LiteralUnion<BuiltInProviderType, string>,
  ClientSafeProvider
> | null;

interface LoginProps {
  providers: NextAuthProvidersType;
}

const Login: React.FC<LoginProps> = ({ providers }) => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-black">
      <img
        src="https://links.papareact.com/9xl"
        className="mb-5 w-52"
        alt="spotify-logo"
      />
      {providers != null &&
        Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button
              className="rounded-full bg-[#18D860] p-5 text-white"
              onClick={() => signIn(provider.id, { callbackUrl: '/' })}
            >
              Login with {provider.name}
            </button>
          </div>
        ))}
    </div>
  );
};

export const getServerSideProps = async () => {
  const providers: NextAuthProvidersType = await getProviders();

  return {
    props: {
      providers,
    },
  };
};

export default Login;
