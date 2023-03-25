export const liteImageConfig = {
  lite: ( import.meta.env.VITE_LITE_IMAGE).toLowerCase() === "true",
  placeholder:  "bg-gray-500"
};
//using export value from the global variable does't seem to get the results I want. gonna use a static string instead still works the same but I wonder why it won't load