import { Combobox } from '@/components/Combobox';
import { InlineLink } from '@/components/InlineLink';
import { PageContent } from '@/components/PageContent';
import { PageHeader } from '@/components/PageHeader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSubtleCrypto } from '@rain-cafe/react-utils';
import { useState } from 'react';

export enum HashingAlgorithm {
  // MD5 = 'md5',
  SHA1 = 'SHA-1',
  SHA256 = 'SHA-256',
  SHA384 = 'SHA-384',
  SHA512 = 'SHA-512',
}

const frameworks: Combobox.Option<HashingAlgorithm>[] = [
  {
    value: HashingAlgorithm.SHA1,
    label: 'sha1',
  },
  {
    value: HashingAlgorithm.SHA256,
    label: 'sha256',
  },
  {
    value: HashingAlgorithm.SHA384,
    label: 'sha384',
  },
  {
    value: HashingAlgorithm.SHA512,
    label: 'sha512',
  },
];

export function HashingPage() {
  const [value, setValue] = useState('');
  const [algorithm, setAlgorithm] = useState<HashingAlgorithm>();
  const output = useSubtleCrypto(algorithm, value, '');

  return (
    <>
      <PageHeader className="justify-between">
        <h1 className="text-2xl leading-none">Hashing</h1>
      </PageHeader>
      <PageContent>
        <h2 className="text-xl leading-none">Description</h2>
        <div>
          This tool currently supports hashing via the
          <InlineLink to="https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#algorithm">
            Subtle Crypto API
          </InlineLink>
          native to your browser, as such hashing is limited to the following formats. (sha-1, sha-256, sha-384,
          sha-512)
        </div>
        <Label htmlFor="value">Input</Label>
        <div className="flex gap-2 flex-col md:flex-row">
          <Input
            id="value"
            value={value}
            placeholder="Please specify a value to hash..."
            onChange={(e) => setValue(e.target.value)}
          />
          <Combobox
            options={frameworks}
            placeholder={{
              search: 'Search algorithm...',
              select: 'Select algorithm...',
            }}
            onChange={(value) => setAlgorithm(value)}
          />
        </div>
        <Label htmlFor="output">Output</Label>
        <Input id="output" value={output} readOnly />
      </PageContent>
    </>
  );
}
