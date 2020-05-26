export interface IReportEntry {
    key: string;
    displayKey: string;
    income: Data;
    expense: Data;
    overall: number;
}

export interface Data {
    total: number;
    average: number;
    occurences: number;
}