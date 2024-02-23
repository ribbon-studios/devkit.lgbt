import { NoteItem } from '@/components/NoteItem';
import { PageContent } from '@/components/PageContent';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { useBetterLoaderData } from '@/hooks/use-loader-data';
import { Notes, Storage, StorageKeys } from '@/storage';
import { createId } from '@paralleldrive/cuid2';
import { BadgePlus } from 'lucide-react';

export async function loader() {
  return await Storage.get(StorageKeys.NOTES);
}

export function Component() {
  const [notes, setNotes] = useBetterLoaderData<Notes.List[]>();

  if (!notes) return null;

  return (
    <>
      <PageHeader className="justify-between">
        <h1 className="text-2xl leading-none">Notes</h1>
        <Button
          className="shrink-0"
          size="icon"
          variant="ghost"
          onClick={async () => {
            const note: Notes.List = {
              id: createId(),
              text: '',
            };

            setNotes([...notes, note]);
            Storage.set(StorageKeys.NOTES, note);
          }}
        >
          <BadgePlus />
        </Button>
      </PageHeader>
      <PageContent>
        {notes.length === 0 ? (
          <div className="text-md text-center italic flex flex-col items-center gap-2">
            <span>It looks like you don't have any notes!</span>
            <span>Click the add button in the top right to create one!</span>
          </div>
        ) : (
          <>
            {notes.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                onDelete={async () => {
                  setNotes(notes.filter((x) => x.id !== note.id));
                  await Storage.delete(StorageKeys.NOTES, note.id);
                }}
              />
            ))}
          </>
        )}
      </PageContent>
    </>
  );
}

Component.displayName = 'NotesPage';
