import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { BrandChip } from '@/components/brand';
import { appName, links } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <BrandChip size="sm" />
          <span className="sr-only">{appName}</span>
        </>
      ),
    },
    githubUrl: links.github,
  };
}
