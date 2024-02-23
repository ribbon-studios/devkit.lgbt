import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Toaster } from '@/components/ui/sonner';
import { loadSettings } from '@/slices/settings.slice';
import { useAppDispatch } from '@/slices/state';
import { Home } from 'lucide-react';
import { useState } from 'react';
import { Link, Outlet, useRouteError } from 'react-router-dom';
import { useEffectOnce } from 'usehooks-ts';

export function Component() {
  const dispatch = useAppDispatch();
  const [isLoading, setLoading] = useState(true);

  useEffectOnce(() => {
    const load = async () => {
      await Promise.all([dispatch(loadSettings())]);

      setLoading(false);
    };

    load();
  });

  if (isLoading) {
    return <div />;
  }

  return (
    <Header>
      <Outlet />
      <Toaster />
    </Header>
  );
}

export function ErrorBoundary() {
  const error = useRouteError() as any;
  console.error(error);

  return (
    <div id="error-page" className="flex flex-col items-center pt-20">
      <Card className="sm:max-w-2xl">
        <CardHeader>
          <CardTitle>Oops!</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <p>Sorry, an unexpected error has occurred.</p>
          <code className="flex p-2 rounded-md bg-secondary/50 text-pink-400 w-full italic">
            {error.statusText || error.message}
          </code>
        </CardContent>
        <CardFooter>
          <Button className="w-full" asChild variant="secondary">
            <Link to="/">
              <Home className="mr-2 size-4" /> Go Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

ErrorBoundary.displayName = 'ErrorPage';
