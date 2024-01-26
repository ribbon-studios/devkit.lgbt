import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Home } from 'lucide-react';
import { Link, useRouteError } from 'react-router-dom';

export function ErrorPage() {
  const error = useRouteError() as any;
  console.error(error);

  return (
    <div id="error-page" className="flex flex-col items-center pt-20">
      <Card>
        <CardHeader>
          <CardTitle>Oops!</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <p>Sorry, an unexpected error has occurred.</p>
          <code className="flex p-2 rounded-md bg-secondary/50 w-full italic">{error.statusText || error.message}</code>
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
