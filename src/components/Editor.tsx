import {
  blockquote,
  bold,
  bulletList,
  code,
  codeBlock,
  hardBreak,
  heading,
  horizontalRule,
  image,
  italic,
  link,
  listItem,
  orderedList,
  paragraph,
  strike,
  underline,
} from '@bangle.dev/base-components';
import { Plugin, PluginKey, SpecRegistry } from '@bangle.dev/core';
import '@bangle.dev/core/style.css';
import { markdownParser, markdownSerializer } from '@bangle.dev/markdown';
import { BangleEditor, useEditorState } from '@bangle.dev/react';
import { ComponentProps, useMemo } from 'react';

// TODO: Remove this when https://github.com/bangle-io/bangle-editor/pull/272 is merged
((has) => {
  WeakMap.prototype.has = function (key: WeakKey) {
    if (key instanceof HTMLDivElement && key.parentElement?.id === 'bangle-editor') return false;

    return has.bind(this)(key);
  };
})(WeakMap.prototype.has);

const specRegistry = new SpecRegistry([
  blockquote.spec(),
  bold.spec(),
  bulletList.spec(),
  code.spec(),
  codeBlock.spec(),
  hardBreak.spec(),
  heading.spec(),
  horizontalRule.spec(),
  image.spec(),
  italic.spec(),
  link.spec(),
  listItem.spec(),
  orderedList.spec(),
  paragraph.spec(),
  strike.spec(),
  underline.spec(),
]);
const parser = markdownParser(specRegistry);
const serializer = markdownSerializer(specRegistry);

export type EditorProps = {
  initialValue?: string;
  onChange?: (value: string) => void;
} & Omit<ComponentProps<'div'>, 'onChange'>;

export function DevkitEditor({ initialValue: externalInitialValue, onChange, ...props }: EditorProps) {
  const initialValue = useMemo(() => {
    return externalInitialValue ? parser.parse(externalInitialValue) ?? undefined : undefined;
  }, []);

  const plugin = useMemo(() => {
    return new Plugin({
      key: new PluginKey('updatePlugin'),
      view: () => ({
        update: (view, prevState) => {
          if (view.state.doc.eq(prevState.doc)) return;

          onChange?.(serializer.serialize(view.state.doc));
        },
      }),
    });
  }, []);

  const editorState = useEditorState({
    specRegistry,
    plugins: () =>
      [
        plugin,
        blockquote.plugins(),
        bold.plugins(),
        bulletList.plugins(),
        code.plugins(),
        codeBlock.plugins(),
        hardBreak.plugins(),
        heading.plugins(),
        horizontalRule.plugins(),
        image.plugins(),
        italic.plugins(),
        link.plugins(),
        listItem.plugins(),
        orderedList.plugins(),
        paragraph.plugins(),
        strike.plugins(),
        underline.plugins(),
      ] as any,
    initialValue: initialValue,
  });

  return (
    <div {...props} id="bangle-editor">
      <BangleEditor state={editorState} onReady={(editor) => editor.view.state.doc} />
    </div>
  );
}
