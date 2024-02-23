import { ConfirmDialog } from '@/components/ConfirmDialog';
import { PageContent } from '@/components/PageContent';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { useBetterLoaderData } from '@/hooks/use-loader-data';
import { Notes, Storage, StorageKeys } from '@/storage';
import { createId } from '@paralleldrive/cuid2';
import { BadgePlus, Flame, NotebookText } from 'lucide-react';
import { Link } from 'react-router-dom';

export function NotesPage() {
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
            {notes.map(({ id, text }) => (
              <div className="flex gap-2" key={id}>
                <Button className="flex flex-1 justify-start gap-2 overflow-hidden" asChild variant="secondary">
                  <Link to={`/notes/${id}`}>
                    <NotebookText />
                    <div className="truncate">{text.split('\n')[0] || 'Unnamed Note'}</div>
                  </Link>
                </Button>
                <ConfirmDialog
                  description="This action cannot be undone. This will permanently delete this list."
                  onSubmit={async () => {
                    setNotes(notes.filter((note) => note.id !== id));
                    await Storage.delete(StorageKeys.NOTES, id);
                  }}
                >
                  <Button className="shrink-0" variant="destructive" size="icon">
                    <Flame />
                  </Button>
                </ConfirmDialog>
              </div>
            ))}
          </>
        )}
      </PageContent>
    </>
  );
}

export namespace NotesPage {
  export async function loader() {
    return await Storage.get(StorageKeys.NOTES);
  }
}
