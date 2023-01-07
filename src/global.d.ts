//d=declaration, file with types
/*
надо сказать, что import html файла - это модуль который возвращает строку
*/
declare module "*.html" {
  export default typeof String;
}

declare module "*.png" {
  export default typeof String;
}

declare module "*.webp" {
  export default typeof String;
}

declare module "*.svg?inline" {
  export default content;
}

declare module "*.svg" {
  export default content;
}
