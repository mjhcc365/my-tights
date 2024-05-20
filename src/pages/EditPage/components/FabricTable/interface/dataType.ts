type RawData = Record<string, string | number>;

export interface DataConfig {
  data: RawData[];
  fields: {
    rows: string[];
    columns: string[];
    values: string[];
  };
}
