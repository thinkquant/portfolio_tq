import type { ReactNode } from 'react';

export type RouteDataState<T> =
  | {
      status: 'loading';
      title: string;
      message: string;
    }
  | {
      status: 'error';
      title: string;
      message: string;
      detail?: string;
      action?: ReactNode;
    }
  | {
      status: 'empty';
      title: string;
      message: string;
      action?: ReactNode;
    }
  | {
      status: 'success';
      data: T;
    };

export function routeDataLoading<T>(
  title: string,
  message: string,
): RouteDataState<T> {
  return {
    status: 'loading',
    title,
    message,
  };
}

export function routeDataError<T>(
  title: string,
  message: string,
  detail?: string,
  action?: ReactNode,
): RouteDataState<T> {
  return {
    status: 'error',
    title,
    message,
    detail,
    action,
  };
}

export function routeDataEmpty<T>(
  title: string,
  message: string,
  action?: ReactNode,
): RouteDataState<T> {
  return {
    status: 'empty',
    title,
    message,
    action,
  };
}

export function routeDataSuccess<T>(data: T): RouteDataState<T> {
  return {
    status: 'success',
    data,
  };
}
