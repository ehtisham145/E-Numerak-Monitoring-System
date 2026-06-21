export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-hairline bg-panel/40 px-6 py-14 text-center">
      {Icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-raised text-mist">
          <Icon size={22} />
        </div>
      )}
      <p className="font-display text-base font-semibold text-paper">{title}</p>
      {description && <p className="mt-1.5 max-w-sm text-sm text-mist">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
