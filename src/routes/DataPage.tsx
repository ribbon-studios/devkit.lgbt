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

  return (
    <>
      <PageHeader className="justify-between">
        <h1 className="text-2xl leading-none">Data</h1>
        <Button variant="destructive" onClick={onClear} disabled={loading}>
          Clear
        </Button>
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
