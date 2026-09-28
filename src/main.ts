import "@fontsource-variable/montserrat/wght.css";
import "@fontsource/dm-mono/400.css";
import "@fontsource/dm-mono/500.css";
import "./tokens.css";
import "./main.css";
import { mountApp } from "./app";

const root = document.getElementById("app");
if (root) mountApp(root);
