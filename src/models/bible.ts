/** @format */

import fetch from "node-fetch";
import { iVerse, Verse } from "./verse";

export const URL =
	"https://www.revisedenglishversion.com/jsonrevexport.php?permission=yUp&autorun=1&what=bible";

export interface iBibleJson {
	date?: Date | string;
	// eslint-disable-next-line camelcase
	REV_Bible: iVerse[];
}

export class Bible {
	private static verses: Verse[];

	public static get data(): Verse[] {
		return Bible.verses;
	}

	public static set data(verses: Verse[]) {
		Bible.verses = verses;
	}

	private constructor(verses?: iVerse[]) {
		if (verses) Bible.verses = verses.map((v) => new Verse(v));
		else if (!Bible.verses) Bible.fetch();
	}

	save?: (bible: Bible) => void;

	private selectedBook?: string;

	private selectedChapter?: number;

	private selectedVerse?: number;

	private static async fetch() {
		console.log("Fetching bible from web. Please wait...");

		const res = await fetch(URL);
		const bible: iBibleJson = await res.json();
		Bible.verses = bible.REV_Bible.map((v) => new Verse(v));
		console.log("Bible downloaded!");
	}

	static async onReady(): Promise<Bible> {
		if (Bible.verses) return new Bible();
		else await Bible.fetch();
		return new Bible();
	}

	getFunnyVerses(): string[] {
		const funnyVerses = Bible.verses
			.map((v) => v.html())
			.filter((v) => v.indexOf("[") >= 0 || v.indexOf("]") >= 0);
		// .map(v => v.slice(v.indexOf("["), v.indexOf("]")));
		return funnyVerses;
	}

	getBooks(): string[] {
		const booksArray = Bible.verses.map((v) => v.book);
		const bookSet = new Set(booksArray);
		return new Array(...bookSet.keys());
	}

	getChapters(book: string): number[] {
		const chaptersArray = Bible.verses
			.filter((v) => v.book === book)
			.map((v) => v.chapter);
		const chapterSet = new Set(chaptersArray);
		return new Array(...chapterSet.keys());
	}

	numChapters(book: string): number {
		return this.getChapters(book).length;
	}

	getVerses(book: string, chapter: number, verse?: number): Verse[] {
		if (verse)
			return Bible.verses.filter(
				(v) => v.book === book && v.chapter === chapter && v.verse === verse,
			);
		return Bible.verses.filter((v) => v.book === book && v.chapter === chapter);
	}

	getVerseNumbers(book: string, chapter: number): number[] {
		return this.getVerses(book, chapter).map((v) => v.verse);
	}

	numVerses(book: string, chapter: number): number {
		return this.getVerses(book, chapter).length;
	}

	ls(): Verse[] | number[] | string[] {
		if (this.selectedVerse && this.selectedChapter && this.selectedBook)
			return this.getVerses(
				this.selectedBook,
				this.selectedChapter,
				this.selectedVerse,
			);
		if (this.selectedChapter && this.selectedBook)
			return this.getVerseNumbers(this.selectedBook, this.selectedChapter);
		if (this.selectedBook) return this.getChapters(this.selectedBook);
		return this.getBooks();
	}

	selectBook(book: string): void {
		this.getBooks().forEach((bk) => {
			if (bk === book) this.selectedBook = book;
		});
	}

	selectChapter(chapter: number): void {
		if (!this.selectedBook) return;
		if (chapter > this.numChapters(this.selectedBook)) return;
		this.selectedChapter = chapter;
	}

	selectVerse(verse: number): void {
		if (!this.selectedBook || !this.selectedChapter) return;
		if (verse > this.numVerses(this.selectedBook, this.selectedChapter)) return;
		this.selectedVerse = verse;
	}

	up(): void {
		if (this.selectedVerse) this.selectedVerse = undefined;
		else if (this.selectedChapter) this.selectedChapter = undefined;
		else this.selectedBook = undefined;
	}
}
