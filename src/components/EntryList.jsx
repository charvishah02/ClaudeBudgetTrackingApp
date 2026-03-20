import EntryRow from './EntryRow';

export default function EntryList({ entries, onDelete, emptyMessage }) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-gray-400 italic py-3 px-3">{emptyMessage}</p>
    );
  }

  return (
    <div className="divide-y divide-pink-50">
      {entries.map((entry) => (
        <EntryRow key={entry.id} entry={entry} onDelete={onDelete} />
      ))}
    </div>
  );
}
