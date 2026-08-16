import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In — BizSocial',
  description: 'Sign in to BizSocial with Google or Facebook to access the all-in-one business social platform.',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
