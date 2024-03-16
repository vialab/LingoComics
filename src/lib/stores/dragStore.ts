import { writable, type Writable } from 'svelte/store';
import type { DragPair } from '../../utils/types';

export const dragAssociationPairs: Writable<DragPair[]> = writable([]);