import { PageContent } from '@/components/PageContent';
import { PageHeader } from '@/components/PageHeader';
import { RouteToggle } from '@/components/settings/RouteToggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { selectSettings, toggleRoute } from '@/slices/settings.slice';
import { useAppDispatch } from '@/slices/state';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { ROUTES, RouteID, SUB_ROUTES } from '.';

const SETTING_ROUTES = [...ROUTES, ...SUB_ROUTES].filter((route) => route.id !== RouteID.SETTINGS);

export function Component() {
  const dispatch = useAppDispatch();
  const settings = useSelector(selectSettings);

  return (
    <>
      <PageHeader className="justify-between">
        <h1 className="text-2xl leading-none">Settings</h1>
      </PageHeader>
      <PageContent>
        <Card>
          <CardHeader>
            <CardTitle>Pages</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 items-start">
            <div>Have any pages you aren't interested in? Disable them here!</div>
            <div className="grid grid-cols-2 gap-2">
              {SETTING_ROUTES.map((route) => (
                <RouteToggle
                  key={route.id}
                  route={route}
                  pressed={settings.routes.includes(route.id)}
                  onChange={async () => {
                    toast.promise(
                      async () => {
                        await dispatch(toggleRoute(route.id));
                      },
                      {
                        success: 'Settings have been saved!',
                        error: 'Oops! Looks like an error occurred while saving!',
                      }
                    );
                  }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </PageContent>
    </>
  );
}

Component.displayName = 'SettingsPage';
