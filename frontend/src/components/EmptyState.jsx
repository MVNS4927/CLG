import { FiInbox } from 'react-icons/fi';

export default function EmptyState({ title = 'Nothing here yet', subtitle = 'Try adding something new.' }) {
  return (
    <div className="card p-6 flex flex-col items-center text-center gap-2">
      <div className="h-12 w-12 grid place-content-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500">
        <FiInbox />
      </div>
      <p className="font-semibold">{title}</p>
      <p className="subtle">{subtitle}</p>
    </div>
  );
}
