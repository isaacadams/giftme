import React from 'react';

export type ChildRenderFunction<T = {}> = (params: T) => React.ReactNode;
export type Scalar = string | number | boolean;
export type NonNullable<T> = T extends null | undefined ? never : T;
export type EmailLike = `${string}@${string}.${string}`;
