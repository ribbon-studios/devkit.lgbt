import { Label } from '@/components/ui/label';
import { Route } from '@/routes';
import React from 'react';
import { Switch } from '../ui/switch';

export type RouteToggleProps = {
  route: Route;
  checked: boolean;
  onChange: () => void;
};

export function RouteToggle({ route, checked, onChange }: RouteToggleProps) {
  return (
    <React.Fragment>
      <Label htmlFor={route.path} className="flex gap-2 items-center text-md">
        <route.icon size={20} />
        {route.label}
      </Label>
      <Switch id={route.path} checked={checked} onCheckedChange={onChange} />
    </React.Fragment>
  );
}
