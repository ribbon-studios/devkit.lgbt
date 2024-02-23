import { PageContent } from '@/components/PageContent';
import { PageHeader } from '@/components/PageHeader';
import { Textarea } from '@/components/ui/textarea';
import { useBetterLoaderData } from '@/hooks/use-loader-data';
import { Notes, Storage, StorageKeys } from '@/storage';
import { Link, LoaderFunctionArgs, redirect } from 'react-router-dom';

export function NotePage() {
  const [note, setNote] = useBetterLoaderData<Notes.List>();
  const name = note.text.split('\n')[0] || 'Unnamed Note';

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
        <Textarea
          className="flex-1 resize-none"
          value={note.text}
          onKeyDown={(e) => {
            if (e.key === 'Tab') {
              e.preventDefault();
              const { selectionStart, selectionEnd, value } = e.currentTarget;

              // set textarea value to: text before caret + tab + text after caret
              e.currentTarget.value = `${value.substring(0, selectionStart)}\t${value.substring(selectionEnd)}`;

              // put caret at right position again
              e.currentTarget.selectionStart = e.currentTarget.selectionEnd = selectionStart + 1;
            }
          }}
          onChange={(e) =>
            onChange({
              ...note,
              text: e.target.value,
            })
          }
        />
      </PageContent>
    </>
  );
}

export namespace NotePage {
  export async function loader({ params }: LoaderFunctionArgs<any>) {
    if (!params.id) return redirect('/');

    const list = await Storage.get(StorageKeys.NOTES, params.id);

    if (!list) return redirect('/notes');

    return list;
  }
}
