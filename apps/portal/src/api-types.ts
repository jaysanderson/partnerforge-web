import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '@partnerforge/api';

export type RouterOutputs = inferRouterOutputs<AppRouter>;
export type Opportunity = RouterOutputs['sf']['opportunities'][number];
export type SfAsset = RouterOutputs['sf']['assets'][number];
export type SfQuote = RouterOutputs['sf']['quotes'][number];
