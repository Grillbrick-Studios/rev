export interface iData<T> {
	data: T[];
	ls: () => string[];
	up: () => boolean;
	select: (target: string) => void;
	path: string;
}
