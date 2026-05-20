import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '@partnerforge/api';

export type RouterOutputs = inferRouterOutputs<AppRouter>;

export type PartnerRow = RouterOutputs['partners']['list'][number];
export type DealRow = RouterOutputs['deals']['list'][number];
export type ContentRow = RouterOutputs['content']['list'][number];
