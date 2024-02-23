import { PageContent } from '@/components/PageContent';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useBetterLoaderData } from '@/hooks/use-loader-data';
import { Storage } from '@/storage';
import { Fragment, useState } from 'react';
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
  const [data, setData] = useBetterLoaderData<Storage.Data.Raw>();
  const [loading, setLoading] = useState(false);

  const onClear = async () => {
    setLoading(true);

    try {
      await Storage.clear();

      setData(await Storage.everything(true));
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
      setData(await Storage.everything(true));
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
          <Button variant="ghost" onClick={onImport} disabled={noClipboardRead}>
            Import
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              navigator.clipboard.writeText(btoa(JSON.stringify(data)));
            }}
            disabled={noClipboardWrite}
          >
            Export
          </Button>
          <Button variant="destructive" onClick={onClear} disabled={loading}>
            Clear
          </Button>
        </div>
      </PageHeader>
      <PageContent>
        {Object.keys(data).map((key) => (
          <Fragment key={key}>
            <Label htmlFor={key}>{KEY_TO_LABEL[key]}</Label>
            <SyntaxHighlighter language="json" style={a11yDark}>
              {data[key]}
            </SyntaxHighlighter>
          </Fragment>
        ))}
      </PageContent>
    </>
  );
}

export namespace DataPage {
  export async function loader(): Promise<Storage.Data.Raw> {
    return await Storage.everything(true);
  }
}
