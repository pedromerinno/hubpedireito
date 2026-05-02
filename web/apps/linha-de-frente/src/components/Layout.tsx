import { SiteFooter } from "@/components/SiteFooter";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <div className="min-h-screen flex flex-col bg-cream">
    <main className="flex-1">{children}</main>
    <SiteFooter />
  </div>
);

export { Layout };
