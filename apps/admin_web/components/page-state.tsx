"use client";

export function PageIntro({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <>
      <h2 className="page-title">{title}</h2>
      <p className="muted">{description}</p>
    </>
  );
}

export function LoadingBanner({ visible }: { visible: boolean }) {
  if (!visible) {
    return null;
  }

  return <div className="loading-bar" aria-hidden="true" />;
}

export function ErrorBanner({ message }: { message: string | null }) {
  if (!message) {
    return null;
  }

  return <p className="status-inline status-danger">{message}</p>;
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="panel-card">
      <p className="muted">{message}</p>
    </div>
  );
}
