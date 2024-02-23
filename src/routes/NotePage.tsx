import { DevkitEditor } from '@/components/Editor';
import { PageContent } from '@/components/PageContent';
import { PageHeader } from '@/components/PageHeader';
import { useBetterLoaderData } from '@/hooks/use-loader-data';
import { useTitle } from '@/lib/notes';
import { Notes, Storage, StorageKeys } from '@/storage';
import { Link, LoaderFunctionArgs, redirect } from 'react-router-dom';

export async function loader({ params }: LoaderFunctionArgs<any>) {
  if (!params.id) return redirect('/');

  const list = await Storage.get(StorageKeys.NOTES, params.id);

  if (!list) return redirect('/notes');

  return list;
}

export function Component() {
  const [note, setNote] = useBetterLoaderData<Notes.List>();
  const name = useTitle(note);

  const onChange = async (updatedNote: Notes.List) => {
    setNote(updatedNote);
    await Storage.set(StorageKeys.NOTES, updatedNote);
  };

  return (
    <>
      <PageHeader className="text-2xl">
        <Link className="hover:underline" to="/notes">
          Notes
        </Link>
        <div>&gt;</div>
        <div className="truncate">{name}</div>
      </PageHeader>
      <PageContent>
        <DevkitEditor
          className="flex-1"
          initialValue={note.text}
          onChange={(value) => {
            onChange({
              ...note,
              text: value,
            });
          }}
        />
      </PageContent>
    </>
  );
}

Component.displayName = 'NotePage';
