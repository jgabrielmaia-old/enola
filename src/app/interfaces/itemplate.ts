import { IEntity } from "./ientity";

export interface ITemplate {
  name: string;
  base_quote: string;
  entities?: IEntity[];
}
