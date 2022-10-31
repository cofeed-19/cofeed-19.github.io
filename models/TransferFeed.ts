export interface TransferData {
  db: number;
  feed?: TransferFeed[];
}

export interface TransferFeed {
  domain: string;
  url: string;
  visited?: string[];
  favorite?: boolean;
}
