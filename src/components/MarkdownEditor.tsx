import { cn } from '@/lib/utils';
import { Editor, defaultValueCtx, editorViewOptionsCtx, rootCtx } from '@milkdown/core';
import { indent } from '@milkdown/plugin-indent';
import { listener, listenerCtx } from '@milkdown/plugin-listener';
import { commonmark } from '@milkdown/preset-commonmark';
import { gfm } from '@milkdown/preset-gfm';
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react';
import './MarkdownEditor.css';

export type MilkdownEditorProps = {
  value?: string;
  onChange?: (value: string) => void;
};

const MilkdownEditor: React.FC<MilkdownEditorProps> = ({ value, onChange }) => {
  const { get } = useEditor((root) =>
    Editor.make()
      .config((ctx) => {
        ctx.update(editorViewOptionsCtx, (prev) => ({
          ...prev,
          attributes: { class: 'milkdown-editor flex-1 outline-none', spellcheck: 'false' },
        }));

        ctx.set(rootCtx, root);
        ctx.get(listenerCtx).markdownUpdated((_, markdown) => onChange?.(markdown));

        if (value) ctx.set(defaultValueCtx, value);
      })
      .use(commonmark)
      .use(gfm)
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
    <div className={cn('flex flex-col', className)}>
      <MilkdownProvider>
        <MilkdownEditor {...props} />
      </MilkdownProvider>
    </div>
  );
};
