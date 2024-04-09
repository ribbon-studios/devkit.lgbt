import { cn } from '@/lib/utils';
import { ROUTES, Route, RouteID, SUB_ROUTES } from '@/routes';
import { LoadingKey, isLoading } from '@/slices/loading.slice';
import { selectDeveloperSetting, selectSettingsRoutes } from '@/slices/settings.slice';
import { useAppSelector } from '@/slices/state';
import { Bug, Code, LucideIcon } from 'lucide-react';
import { useMemo, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ButtonIcon } from './ButtonIcon';
import { Skeleton } from './ui/skeleton';

export type HeaderProps = {
  children: ReactNode;
};

export const ITEMS: (Route | 'split')[] = [...ROUTES, 'split', ...SUB_ROUTES];

export function Header({ children }: HeaderProps) {
  const loading = useAppSelector(isLoading(LoadingKey.SETTINGS));
  const routes = useAppSelector(selectSettingsRoutes);
  const skeletons = useAppSelector(selectDeveloperSetting('skeletons'));
  const skeletonHideContent = useAppSelector(selectDeveloperSetting('skeletonHideContent'));

  const activeItems = useMemo(
    () => ITEMS.filter((item) => typeof item === 'string' || item.id === RouteID.SETTINGS || routes.includes(item.id)),
    [ITEMS, routes]
  );

  return (
    <div className="flex min-h-dvh max-h-dvh">
      <div
        className={
          'flex flex-col bg-background border-r border-r-border shadow-sm shadow-indigo-950 p-2 sm:p-4 gap-2 min-w-8 sm:min-w-60'
        }
      >
        <Link
          className="flex items-center justify-center sm:justify-start font-extrabold text-2xl hover:text-white/80 transition-colors"
          to="/"
        >
          D<span className="hidden sm:inline">evkit</span>
        </Link>
        <div className="relative flex flex-col gap-2 flex-1">
          <div
            className={cn(
              'absolute inset-0 hidden flex-col gap-2 pointer-events-none',
              (loading || skeletons) && 'flex'
            )}
          >
            <div className="flex items-center gap-2 m-2">
              <Skeleton className="size-6" />
              <Skeleton className="h-4 sm:w-16 rounded-full" />
            </div>
            <div className="flex items-center gap-2 m-2">
              <Skeleton className="size-6" />
              <Skeleton className="h-4 sm:w-24 rounded-full" />
            </div>
            <div className="flex items-center gap-2 m-2">
              <Skeleton className="size-6" />
              <Skeleton className="h-4 sm:w-20 rounded-full" />
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-2 m-2">
              <Skeleton className="size-6" />
              <Skeleton className="h-4 sm:w-24 rounded-full" />
            </div>
            <div className="flex items-center gap-2 m-2">
              <Skeleton className="size-6" />
              <Skeleton className="h-4 sm:w-20 rounded-full" />
            </div>
          </div>
          {!loading &&
            !skeletonHideContent &&
            activeItems.map((item, index) => {
              if (item === 'split') {
                return <div key={index} className="flex-1" />;
              }

              return (
                <ButtonIcon key={index} icon={item.icon} to={item.path} variant="ghost">
                  {item.label}
                </ButtonIcon>
              );
            })}
        </div>
        <ButtonIcon icon={Bug} to="https://github.com/ribbon-studios/devkit.lgbt/issues" variant="ghost">
          Report an Issue
        </ButtonIcon>
        <ButtonIcon icon={Code} to="https://github.com/ribbon-studios/devkit.lgbt" variant="ghost">
          Source Code
        </ButtonIcon>
      </div>
      <div className="flex flex-1 flex-col overflow-auto">{children}</div>
    </div>
  );
}

export namespace Header {
  export type Item = {
    label: string;
    path: string;
    icon: LucideIcon;
  };
}
