import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { useTitle } from '@/lib/notes';
import { Notes } from '@/storage';
import { Flame, NotebookText } from 'lucide-react';
import { Link } from 'react-router-dom';

export type NoteItemProps = {
  note: Notes.List;
  onDelete?: (note: Notes.List) => void | Promise<void>;
};

export function NoteItem({ note, onDelete }: NoteItemProps) {
  const name = useTitle(note);

  return (
    <div className="flex gap-2" key={note.id}>
      <Button className="flex flex-1 justify-start gap-2 overflow-hidden" asChild variant="secondary">
        <Link to={`/notes/${note.id}`}>
          <NotebookText />
          <div className="truncate">{name}</div>
        </Link>
      </Button>
      <ConfirmDialog
        description="This action cannot be undone. This will permanently delete this list."
        onSubmit={() => onDelete?.(note)}
      >
        <Button className="shrink-0" variant="destructive" size="icon">
          <Flame />
        </Button>
      </ConfirmDialog>
    </div>
  );
}
