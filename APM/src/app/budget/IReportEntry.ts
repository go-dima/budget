export interface IReportEntry {
    key: string;
    income: Data;
    expense: Data;
    balance: number;
}

export interface Data {
    total: number;
    average: number;
    occurences: number;
}