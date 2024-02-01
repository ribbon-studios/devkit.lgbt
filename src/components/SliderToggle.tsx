import { Toggle, ToggleProps } from '@/components/ui/toggle';
import { cn } from '@/lib/utils';

export function SliderToggle({ className, ...props }: ToggleProps) {
  return (
    <Toggle {...props} className={cn('group relative rounded-md h-4 w-12 my-1 mx-2 bg-secondary', className)}>
      <div className="absolute rounded-full size-5 transition-transform bg-red-500 group-data-[state=on]:bg-green-600 -translate-x-full group-data-[state=on]:translate-x-full" />
    </Toggle>
  );
}
