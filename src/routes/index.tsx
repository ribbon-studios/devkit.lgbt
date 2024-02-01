import { Database, Hash, ListTodo, LucideIcon, NotebookText, Settings } from 'lucide-react';
import { LazyRouteFunction, LoaderFunction, RouteObject } from 'react-router-dom';

export enum RouteID {
  NOTES,
  TODO,
  HASHING,
  DATA,
  SETTINGS,
}

/**
 * Routes that appear at the top of the header
 */
export const ROUTES: Route[] = [
  {
    id: RouteID.NOTES,
    path: '/notes',
    lazy: () => import('./NotesPage'),
    icon: NotebookText,
    label: 'Notes',
  },
  {
    id: RouteID.TODO,
    path: '/todo',
    lazy: () => import('./TodoListsPage'),
    icon: ListTodo,
    label: 'Todo List',
  },
  {
    id: RouteID.HASHING,
    path: '/hash',
    lazy: () => import('./HashingPage'),
    icon: Hash,
    label: 'Hashing',
  },
];

/**
 * Routes that appear at the bottom of the header
 */
export const SUB_ROUTES: Route[] = [
  {
    id: RouteID.DATA,
    path: '/data',
    lazy: () => import('./DataPage'),
    icon: Database,
    label: 'View Data',
  },
  {
    id: RouteID.SETTINGS,
    path: '/settings',
    lazy: () => import('./SettingsPage'),
    icon: Settings,
    label: 'Settings',
  },
];

/**
 * Routes that are linked via another page
 */
export const NESTED_ROUTES: NestedRoute[] = [
  {
    path: '/todo/:id',
    lazy: () => import('./TodoListPage'),
  },
  {
    path: '/notes/:id',
    lazy: () => import('./NotePage'),
  },
];

const routeToReactRoute = ({ path, element: Element, loader, children, lazy }: Route | NestedRoute): RouteObject => ({
  path,
  element: Element ? <Element /> : undefined,
  loader,
  children: children?.map(routeToReactRoute),
  lazy,
});

export const REACT_ROUTES: RouteObject[] = [...ROUTES, ...SUB_ROUTES, ...NESTED_ROUTES].map(routeToReactRoute);

export type Route = {
  id: RouteID;
  path: string;
  loader?: LoaderFunction<any>;
  icon: LucideIcon;
  label: string;
  children?: NestedRoute[];
} & (
  | {
      element: React.ElementType;
      lazy?: never;
    }
  | {
      element?: never;
      lazy: LazyRouteFunction<RouteObject>;
    }
);

export type NestedRoute = Omit<Route, 'icon' | 'label' | 'id'>;
