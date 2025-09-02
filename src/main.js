// alias import test
import { ping } from "./utils/ping";
//styles import
import './styles/base.css'

// basic setup
let app = document.getElementById("app");



const h1 = document.createElement("h1");
h1.textContent = "This works?";

const p1 = document.createElement("p");
p1.textContent = "hello world";

app.append(h1, p1);

ping("testest");