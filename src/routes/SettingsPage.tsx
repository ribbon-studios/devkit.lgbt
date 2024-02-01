import { PageContent } from '@/components/PageContent';
import { PageHeader } from '@/components/PageHeader';
import { SettingInput } from '@/components/SettingInput';
import { SkeletonCard } from '@/components/SkeletonCard';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { LoadingKey, isLoading } from '@/slices/loading.slice';
import { selectSettings, setDeveloperSetting, toggleRoute } from '@/slices/settings.slice';
import { useAppDispatch, useAppSelector } from '@/slices/state';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { ROUTES, RouteID, SUB_ROUTES } from '.';

const SETTING_ROUTES = [...ROUTES, ...SUB_ROUTES].filter((route) => route.id !== RouteID.SETTINGS);

export function Component() {
  const dispatch = useAppDispatch();
  const settings = useSelector(selectSettings);
  const loading = useAppSelector(isLoading(LoadingKey.SETTINGS));

  return (
    <>
      <PageHeader className="justify-between">
        <h1 className="text-2xl leading-none">Settings</h1>
      </PageHeader>
      <PageContent>
        <SkeletonCard
          loading={loading || settings.developer.skeletonHideContent}
          skeleton={settings.developer.skeletons}
          title="Pages"
          lines={5}
        >
          <div>Have any pages you aren't interested in? Disable them here!</div>
          <div className="flex flex-col gap-2">
            {SETTING_ROUTES.map((route) => (
              <SettingInput key={route.id} className="w-40" label={route.label} icon={route.icon}>
                <Switch
                  checked={settings.routes.includes(route.id)}
                  onCheckedChange={() => {
                    toast.promise(async () => dispatch(toggleRoute(route.id)), {
                      success: 'Settings have been saved!',
                      error: 'Oops! Looks like an error occurred while saving!',
                    });
                  }}
                />
              </SettingInput>
            ))}
          </div>
        </SkeletonCard>
        <SkeletonCard loading={loading} skeleton={settings.developer.skeletons} title="Developer Tools" lines={1}>
          <SettingInput label="Developer Mode">
            <Switch
              checked={settings.developer.enabled}
              onCheckedChange={(checked) => {
                toast.promise(async () => dispatch(setDeveloperSetting(['enabled', checked])), {
                  success: 'Settings have been saved!',
                  error: 'Oops! Looks like an error occurred while saving!',
                });
              }}
            />
          </SettingInput>
          {settings.developer.enabled && (
            <>
              <Separator />
              <SettingInput className="w-52" label="Skeletons" description="Always displays skeletons">
                <Switch
                  checked={settings.developer.skeletons}
                  onCheckedChange={(checked) => {
                    toast.promise(async () => dispatch(setDeveloperSetting(['skeletons', checked])), {
                      success: 'Settings have been saved!',
                      error: 'Oops! Looks like an error occurred while saving!',
                    });
                  }}
                />
              </SettingInput>
              {settings.developer.skeletons && (
                <SettingInput className="ml-4 w-48" label="Hide Content">
                  <Switch
                    checked={settings.developer.skeletonHideContent}
                    onCheckedChange={(checked) => {
                      toast.promise(async () => dispatch(setDeveloperSetting(['skeletonHideContent', checked])), {
                        success: 'Settings have been saved!',
                        error: 'Oops! Looks like an error occurred while saving!',
                      });
                    }}
                  />
                </SettingInput>
              )}
            </>
          )}
        </SkeletonCard>
      </PageContent>
    </>
  );
}

Component.displayName = 'SettingsPage';
