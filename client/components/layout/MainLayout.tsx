import Header from './Header';
import SimpleFooter from './SimpleFooter';

export default function MainLayout({
  children,
  showFooter = true,
}: {
  children: React.ReactNode;
  showFooter?: boolean;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1">{children}</div>
      {showFooter ? <SimpleFooter /> : null}
    </div>
  );
}
