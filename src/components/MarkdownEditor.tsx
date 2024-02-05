import { cn } from '@/lib/utils';
import { Editor, defaultValueCtx, editorViewOptionsCtx, rootCtx } from '@milkdown/core';
import { indent } from '@milkdown/plugin-indent';
import { listener, listenerCtx } from '@milkdown/plugin-listener';
import { commonmark } from '@milkdown/preset-commonmark';
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react';
import { nord } from '@milkdown/theme-nord';
import './MarkdownEditor.css';

export type MilkdownEditorProps = {
  value?: string;
  onChange?: (value: string) => void;
};

const MilkdownEditor: React.FC<MilkdownEditorProps> = ({ value, onChange }) => {
  const { get } = useEditor((root) =>
    Editor.make()
      .config(nord)
      .config((ctx) => {
        ctx.update(editorViewOptionsCtx, (prev) => ({
          ...prev,
          attributes: { class: 'milkdown-editor flex-1', spellcheck: 'false' },
        }));

        ctx.set(rootCtx, root);
        ctx.get(listenerCtx).markdownUpdated((_, markdown) => onChange?.(markdown));
        if (value) ctx.set(defaultValueCtx, value);
      })
      .use(commonmark)
      .use(listener)
      .use(indent)
  );

  return <Milkdown />;
};

export const MilkdownEditorWrapper: React.FC<MilkdownEditorProps & { className?: string }> = ({
  className,
  ...props
}) => {
  return (
    <div className={cn('border border-input rounded-md flex flex-col', className)}>
      <MilkdownProvider>
        <MilkdownEditor {...props} />
      </MilkdownProvider>
    </div>
  );
};
