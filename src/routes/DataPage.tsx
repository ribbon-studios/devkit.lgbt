import { PageContent } from '@/components/PageContent';
import { PageHeader } from '@/components/PageHeader';
import { Label } from '@/components/ui/label';
import { Storage } from '@/storage';
import { useMemo } from 'react';
import { useLoaderData } from 'react-router-dom';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

SyntaxHighlighter.registerLanguage('json', json);

export function DataPage() {
  const rawData = useLoaderData() as Storage.Data;
  const data = useMemo<Record<keyof Storage.Data, string>>(
    () => ({
      lists: JSON.stringify(rawData.lists, null, 4),
    }),
    [rawData]
  );

  return (
    <>
      <PageHeader className="text-2xl leading-none">Data</PageHeader>
      <PageContent>
        <Label htmlFor="lists">Todo Lists</Label>
        <SyntaxHighlighter language="json" style={a11yDark}>
          {data.lists}
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
