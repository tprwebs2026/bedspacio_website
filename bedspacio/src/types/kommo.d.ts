export {};

declare global {
    interface Window {
        crmPlugin?: {
        id: string;
        hash: string;
        locale: string;
        setMeta: (p: any) => void;
        params?: any[];
        };
    }
}