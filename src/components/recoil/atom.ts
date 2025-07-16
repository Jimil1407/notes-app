import { atom } from "recoil";

export const notesAtom = atom<{
  id: string;
  title: string;
  description: string;
  category: string;
}[]>({
  key: "notesAtom",
  default: [],
});

export const searchQueryAtom = atom<string>({
  key: "searchQueryAtom",
  default: "",
});

export const isSearchVisibleAtom = atom<boolean>({
  key: "isSearchVisibleAtom",
  default: false,
});