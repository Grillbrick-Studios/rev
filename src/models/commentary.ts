/** @format */
import fetch from "node-fetch";
import { iData } from "./interfaces";

const URL =
	"https://www.revisedenglishversion.com/jsonrevexport.php?permission=yUp&autorun=1&what=commentary";

export interface iCommentary {
	book: string;
	chapter: string;
	verse: string;
	commentary: string;
}

interface CommentaryJson {
	date: Date;
	REV_Commentary: iCommentary[];
}

export class Commentary implements iData<iCommentary> {
	private static _data: iCommentary[];

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	constructor(data: iCommentary[]) {
		Commentary._data = data;
	}

	public get path(): string {
		if (this.selectedVerse)
			return `Commentary for ${this.selectedBook} ${this.selectedChapter}:${this.selectedVerse}`;
		if (this.selectedChapter)
			return `Commentary for ${this.selectedBook} ${this.selectedChapter}`;
		if (this.selectedBook) return `Commentary for ${this.selectedBook}`;
		return "Commentary";
	}

	public get data(): iCommentary[] {
		return Commentary._data;
	}

	private selectedBook?: string;

	private selectedChapter?: number;

	private selectedVerse?: number;

	private static async fetch() {
		console.log("Fetching commentary from web please wait...");
		const res = await fetch(URL);
		console.log("Commentary downloaded!");
		const commentary: CommentaryJson = await res.json();
		Commentary._data = commentary.REV_Commentary;
	}

	static async onReady(): Promise<Commentary> {
		if (Commentary._data) return new Commentary(Commentary._data);
		await Commentary.fetch();
		return new Commentary(Commentary._data);
	}

	getBooks(): string[] {
		const booksArray = Commentary._data.map((v) => v.book);
		const bookSet = new Set(booksArray);
		return new Array(...bookSet.keys());
	}

	getChapters(book: string): string[] {
		const chapterArray = Commentary._data
			.filter((v) => v.book === book)
			.map((v) => v.chapter);
		const chapterSet = new Set(chapterArray);
		return new Array(...chapterSet.keys());
	}

	getVerses(book: string, chapter: number, verse?: number): string[] {
		if (verse) {
			const verseArray = Commentary._data
				.filter(
					(v) =>
						v.book === book &&
						v.chapter === chapter.toString() &&
						v.verse === verse.toString(),
				)
				.map((v) => v.commentary);
			return verseArray;
		}
		const verseArray = Commentary._data
			.filter((v) => v.book === book && v.chapter === chapter.toString())
			.map((v) => v.verse);
		const verseSet = new Set(verseArray);
		return new Array(...verseSet.keys());
	}

	selectBook(book: string): void {
		if (this.getBooks().indexOf(book) >= 0) {
			this.selectedBook = book;
		}
	}

	selectChapter(chapter: number): void {
		if (!this.selectedBook) return;
		if (this.getChapters(this.selectedBook).indexOf(chapter.toString()) >= 0) {
			this.selectedChapter = chapter;
		}
	}

	selectVerse(verse: number): void {
		if (!this.selectedBook || !this.selectedChapter) return;
		if (
			this.getVerses(this.selectedBook, this.selectedChapter).indexOf(
				verse.toString(),
			) >= 0
		) {
			this.selectedVerse = verse;
		}
	}

	ls(): string[] {
		const { selectedVerse, selectedChapter, selectedBook } = this;
		if (selectedBook) {
			if (selectedChapter) {
				if (selectedVerse) {
					return this.getVerses(selectedBook, selectedChapter, selectedVerse);
				}
				return this.getVerses(selectedBook, selectedChapter);
			}
			return this.getChapters(selectedBook);
		}
		return this.getBooks();
	}

	up(): boolean {
		if (this.selectedVerse) {
			this.selectedVerse = undefined;
			return true;
		} else if (this.selectedChapter) {
			this.selectedChapter = undefined;
			return true;
		} else if (this.selectedBook) {
			this.selectedBook = undefined;
			return true;
		}
		return false;
	}

	select(target: string): void {
		if (this.selectedVerse) this.selectVerse(parseInt(target));
		else if (this.selectedChapter) this.selectVerse(parseInt(target));
		else if (this.selectedBook) this.selectChapter(parseInt(target));
		else this.selectBook(target);
	}
}
