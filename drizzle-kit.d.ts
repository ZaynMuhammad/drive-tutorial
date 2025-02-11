declare module "drizzle-kit" {
  export type Config = {
    schema: string;
    dialect: "postgresql" | "mysql" | "sqlite" | "singlestore";
    // tablesFilter: string[];
    dbCredentials?: {
      host: string;
      port: number;
      user: string;
      password: string;
      database: string;
      ssl?: object;
    };
  };
} 