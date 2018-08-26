export interface ITransaction {
    account: string;
    date: string;
    description: string;
    category: string;
    reference: number;
    amount: number;
    balance: number;
    comments: string;
}