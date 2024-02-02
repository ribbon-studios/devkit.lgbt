import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

export type SettingInputProps = {
  icon?: LucideIcon;
  label: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function SettingInput({ icon: Icon, label, description, children, className }: SettingInputProps) {
  return (
    <div className={cn('flex gap-4 w-max', description ? 'items-end' : 'items-center', className)}>
      <div className="flex flex-col gap-1 flex-1">
        <Label className="flex gap-2 text-sm items-center">
          {Icon && <Icon size={20} />}
          {label}
        </Label>
        {description && <div className="text-xs">{description}</div>}
      </div>
      {children}
    </div>
  );
}
