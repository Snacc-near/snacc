import { source } from '@/lib/source';
import { DocsLayout } from '@/components/ai/layout';
import { TopBar } from '@/components/top-bar';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <>
      <TopBar />
      <DocsLayout tree={source.getPageTree()} {...baseOptions()}>
        {children}
      </DocsLayout>
    </>
  );
}
