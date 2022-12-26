//d=declaration, file with types
/*
надо сказать, что import html файла - это модуль который возвращает строку
*/
declare module "*.html" {
  export default typeof String;
}
