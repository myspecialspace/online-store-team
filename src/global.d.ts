declare module "*.html" {
  export default typeof String;
}

declare module "*.png" {
  export default typeof String;
}

declare module "*.svg?inline" {
  export default content;
}

declare module "*.svg" {
  export default content;
}

declare module "*.webp" {
  export default typeof String;
}
