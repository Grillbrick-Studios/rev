/** @format */
import fetch from "node-fetch";

const URL =
	"https://www.revisedenglishversion.com/jsonrevexport.php?permission=yUp&autorun=1&what=appendices";

interface iAppendices {
	title: string;
	appendix: string;
}

export interface iAppendicesJson {
	date: Date;
	REV_Appendices: iAppendices[];
}

export class Appendices {
	private static data: iAppendices[];

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	private constructor() {}

	private static async fetch() {
		console.log("Fetching appendices from the web. please wait...");
		const res = await fetch(URL);
		console.log("appendices downloaded!");
		const commentary = await res.json();
		Appendices.data = commentary;
	}

	static async onReady(): Promise<Appendices> {
		if (Appendices.data) return new Appendices();
		await Appendices.fetch();
		return new Appendices();
	}

	getTitles(): string[] {
		return Appendices.data.map((a) => a.title);
	}

	getAppendix(title: string): string {
		return Appendices.data.filter((a) => a.title === title)[0].appendix;
	}
}
