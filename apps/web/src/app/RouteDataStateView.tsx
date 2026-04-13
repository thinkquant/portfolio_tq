import { Callout, Card, EmptyState, SectionHeading } from '@portfolio-tq/ui';
import type { ReactNode } from 'react';

import type { RouteDataState } from './routeData';

type RouteDataStateViewProps<T> = {
  state: RouteDataState<T>;
  children: (data: T) => ReactNode;
};

export function RouteDataStateView<T>({
  state,
  children,
}: RouteDataStateViewProps<T>) {
  switch (state.status) {
    case 'loading':
      return (
        <div role="status">
          <Card className="grid gap-4">
            <SectionHeading lead={state.message} title={state.title} />
            <div className="grid gap-3">
              <div className="h-3 rounded-[var(--radius)] bg-border/80" />
              <div className="h-3 w-10/12 rounded-[var(--radius)] bg-border/80" />
              <div className="h-24 rounded-[var(--radius)] border border-dashed border-border/80 bg-background/45" />
            </div>
          </Card>
        </div>
      );
    case 'error':
      return (
        <Callout title={state.title} tone="danger">
          <p>{state.message}</p>
          {state.detail ? <p className="mt-3 text-sm">{state.detail}</p> : null}
          {state.action ? <div className="mt-4">{state.action}</div> : null}
        </Callout>
      );
    case 'empty':
      return (
        <EmptyState
          action={state.action}
          message={state.message}
          title={state.title}
        />
      );
    case 'success':
      return <>{children(state.data)}</>;
    default:
      return null;
  }
}
