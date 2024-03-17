import { writable, type Writable } from "svelte/store";

export const selectedLanguage: Writable<string> = writable('');