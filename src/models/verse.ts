/** @format */

export interface iVerse {
	book: string;
	chapter: number;
	verse: number;
	heading: string;
	microheading: number;
	paragraph: number;
	style: number;
	footnotes: string;
	versetext: string;
}

export class Verse implements iVerse {
	constructor(data: iVerse) {
		this.book = data.book;
		this.chapter = data.chapter;
		this.verse = data.verse;
		this.heading = data.heading;
		this.microheading = data.microheading;
		this.paragraph = data.paragraph;
		this.style = data.style;
		this.footnotes = data.footnotes;
		this.versetext = data.versetext;
	}

	book: string;
	chapter: number;
	verse: number;
	heading: string;
	microheading: number;
	paragraph: number;
	style: number;
	footnotes: string;
	versetext: string;

	public unwrap(): iVerse {
		const {
			book,
			chapter,
			verse,
			heading,
			microheading,
			paragraph,
			style,
			footnotes,
			versetext,
		} = this;
		return {
			book,
			chapter,
			verse,
			heading,
			microheading,
			paragraph,
			style,
			footnotes,
			versetext,
		};
	}

	public html(): string {
		let result = this.versetext;
		result = result?.replace(/\[hp\]/g, "<br />");
		result = result?.replace(/\[hpbegin\]/g, '<div class="hp">');
		result = result?.replace(/\[hpend\]/g, "</div>");
		result = result?.replace(/\[listbegin\]/g, '<div class="list">');
		result = result?.replace(/\[listend\]/g, "</div>");
		result = result?.replace(/\[lb\]/g, "<br />");
		result = result?.replace(
			/\[mvh\]/g,
			`
			<h3>${this.heading}</h3>
			`,
		);
		result = result?.replace(/\[br\]/g, "<br />");
		result = result?.replace(/\[fn\]/g, "<footnote />");
		result = result?.replace(/\[pg\]/g, "<br />");
		result = result?.replace(/\[bq\]/g, '<span class="bq">');
		result = result?.replace(/\[\/bq\]/g, "</span>");
		result = result?.replace(/\[\[/g, "<em>");
		result = result?.replace(/\]\]/g, "</em>");
		result = result?.replace(/\[/g, "<em style='font-weight: lighter;'>");
		result = result?.replace(/\]/g, "</em>");
		return `${this.book} ${this.chapter}:${this.verse} ${result}`;
	}
}
