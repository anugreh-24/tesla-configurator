export interface Color {
  code?: string;
  description?: string;
  price?: number;
}

export interface CarModel {
  code?: string;
  description?: string;
  colors?: Color[];
}

export interface Config {
  id?: number;
  description?: string;
  range?: number;
  speed?: number;
  price?: number;
}

export interface Car {
  car?: CarModel;
  color?: Color;
  imgUrl?: string;
  isTowChecked?: boolean;
  isYokeChecked?: boolean;
  config?: Config
};