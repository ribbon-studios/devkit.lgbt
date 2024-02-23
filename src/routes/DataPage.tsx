import { ConfirmDialog } from '@/components/ConfirmDialog';
import { PageContent } from '@/components/PageContent';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { useBetterLoaderData } from '@/hooks/use-loader-data';
import { Storage } from '@/storage';
import { useState } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

SyntaxHighlighter.registerLanguage('json', json);

const KEY_TO_LABEL: Record<Storage.Keys, string> = {
  [Storage.Keys.LISTS]: 'Todo Lists',
};

export function DataPage() {
  const noClipboardWrite = !navigator.clipboard || !navigator.clipboard.writeText;
  const noClipboardRead = !navigator.clipboard || !navigator.clipboard.readText;
  const [data, setData] = useBetterLoaderData<Storage.Data>();
  const [dataKey, setDataKey] = useState(Storage.Keys.LISTS);
  const [loading, setLoading] = useState(false);

  const onClear = async () => {
    setLoading(true);

    try {
      await Storage.clear();

      setData(await Storage.everything());
    } finally {
      setLoading(false);
    }
  };

  const onImport = async () => {
    setLoading(true);

    try {
      const text = await navigator.clipboard.readText();
      const data: Storage.Data = Storage.convert(JSON.parse(atob(text)) as Storage.Data.Raw);

      await Storage.load(data);
      setData(await Storage.everything());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader className="justify-between">
        <h1 className="text-2xl leading-none">Data</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onImport} disabled={noClipboardRead}>
            Import
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              navigator.clipboard.writeText(btoa(JSON.stringify(data)));
            }}
            disabled={noClipboardWrite}
          >
            Export
          </Button>
          <ConfirmDialog
            description="This action cannot be undone. This will permanently all of your data."
            onSubmit={onClear}
          >
            <Button variant="destructive" disabled={loading}>
              Clear
            </Button>
          </ConfirmDialog>
        </div>
      </PageHeader>
      <PageContent className="gap-4">
        <div className="flex border rounded-md p-2">
          {Object.keys(data).map((key: Storage.Keys) => (
            <Button key={key} size="sm" variant={dataKey === key ? 'default' : 'ghost'} onClick={() => setDataKey(key)}>
              {KEY_TO_LABEL[key]}
            </Button>
          ))}
        </div>
        <h2 className="text-xl leading-none">JSON</h2>
        <SyntaxHighlighter language="json" style={a11yDark} customStyle={{ marginTop: 0 }}>
          {JSON.stringify(data[dataKey], null, 4)}
        </SyntaxHighlighter>
      </PageContent>
    </>
  );
}

export namespace DataPage {
  export async function loader(): Promise<Storage.Data> {
    return await Storage.everything();
  }
}
