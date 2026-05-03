import Header from './Header';
import SimpleFooter from './SimpleFooter';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function MainLayout({
  children,
  showFooter = true,
}: {
  children: React.ReactNode;
  showFooter?: boolean;
}) {
  return (
    <ErrorBoundary>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1">{children}</div>
        {showFooter ? <SimpleFooter /> : null}
      </div>
    </ErrorBoundary>
  );
}
