declare module "favecon" {
  type Icon = {
    rel: string;
    size: number;
    href: string;
  };
  export = {
    getBestIcons(url: string): Promise<Icon[]>;
  };
}
