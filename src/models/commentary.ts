/** @format */
import fetch from "node-fetch";

const URL =
	"https://www.revisedenglishversion.com/jsonrevexport.php?permission=yUp&autorun=1&what=commentary";

interface iCommentary {
	book: string;
	chapter: string;
	verse: string;
	commentary: string;
}

interface CommentaryJson {
	date: Date;
	REV_Commentary: iCommentary[];
}

export class Commentary {
	private static data: iCommentary[];

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	private constructor() {}

	private selectedBook?: string;

	private selectedChapter?: number;

	private selectedVerse?: number;

	private static async fetch() {
		console.log("Fetching commentary from web please wait...");
		const res = await fetch(URL);
		console.log("Commentary downloaded!");
		const commentary: CommentaryJson = await res.json();
		Commentary.data = commentary.REV_Commentary;
	}

	static async onReady(): Promise<Commentary> {
		if (Commentary.data) return new Commentary();
		await Commentary.fetch();
		return new Commentary();
	}

	getBooks(): string[] {
		const booksArray = Commentary.data.map((v) => v.book);
		const bookSet = new Set(booksArray);
		return new Array(...bookSet.keys());
	}

	getChapters(book: string): string[] {
		const chapterArray = Commentary.data
			.filter((v) => v.book === book)
			.map((v) => v.chapter);
		const chapterSet = new Set(chapterArray);
		return new Array(...chapterSet.keys());
	}

	getVerses(book: string, chapter: number, verse?: number): string | string[] {
		if (verse) {
			const verseArray = Commentary.data
				.filter(
					(v) =>
						v.book === book &&
						v.chapter === chapter.toString() &&
						v.verse === verse.toString(),
				)
				.map((v) => v.commentary);
			return verseArray[0];
		}
		const verseArray = Commentary.data
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

	ls(): string | string[] {
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

	up(): void {
		if (this.selectedVerse) this.selectedVerse = undefined;
		else if (this.selectedChapter) this.selectedChapter = undefined;
		else this.selectedBook = undefined;
	}
}
