import { Database, Hash, ListTodo, LucideIcon, NotebookText } from 'lucide-react';
import { LoaderFunction, RouteObject } from 'react-router-dom';
import { DataPage } from './DataPage';
import { HashingPage } from './HashingPage';
import { NotePage } from './NotePage';
import { NotesPage } from './NotesPage';
import { TodoListPage } from './TodoListPage';
import { TodoListsPage } from './TodoListsPage';

/**
 * Routes that appear at the top of the header
 */
export const ROUTES: Route[] = [
  {
    path: '/notes',
    element: NotesPage,
    loader: NotesPage.loader,
    icon: NotebookText,
    label: 'Notes',
  },
  {
    path: '/todo',
    element: TodoListsPage,
    loader: TodoListsPage.loader,
    icon: ListTodo,
    label: 'Todo List',
  },
  {
    path: '/hash',
    element: HashingPage,
    icon: Hash,
    label: 'Hashing',
  },
];

/**
 * Routes that appear at the bottom of the header
 */
export const SUB_ROUTES: Route[] = [
  {
    path: '/data',
    element: DataPage,
    loader: DataPage.loader,
    icon: Database,
    label: 'View Data',
  },
];

/**
 * Routes that are linked via another page
 */
export const NESTED_ROUTES: NestedRoute[] = [
  {
    path: '/todo/:id',
    element: TodoListPage,
    loader: TodoListPage.loader,
  },
  {
    path: '/notes/:id',
    element: NotePage,
    loader: NotePage.loader,
  },
];

const routeToReactRoute = ({ path, element: Element, loader, children }: Route | NestedRoute): RouteObject => ({
  path,
  element: <Element />,
  loader,
  children: children?.map(routeToReactRoute),
});

export const REACT_ROUTES: RouteObject[] = [...ROUTES, ...SUB_ROUTES, ...NESTED_ROUTES].map(routeToReactRoute);

export type Route = {
  path: string;
  element: React.ElementType;
  loader?: LoaderFunction<any>;
  icon: LucideIcon;
  label: string;
  children?: NestedRoute[];
};

export type NestedRoute = Omit<Route, 'icon' | 'label'>;
