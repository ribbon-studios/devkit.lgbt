import { SliderToggle } from '@/components/SliderToggle';
import { Label } from '@/components/ui/label';
import { Route } from '@/routes';
import React from 'react';

export type RouteToggleProps = {
  route: Route;
  pressed: boolean;
  onChange: () => void;
};

export function RouteToggle({ route, pressed, onChange }: RouteToggleProps) {
  return (
    <React.Fragment>
      <Label htmlFor={route.path} className="flex gap-2 items-center text-md">
        <route.icon size={20} />
        {route.label}
      </Label>
      <SliderToggle id={route.path} pressed={pressed} onPressedChange={onChange} />
    </React.Fragment>
  );
}
