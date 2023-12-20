import Palette from "../main";

const P = new Palette("WebGL",
{
    canvas: "#canvas",
    default_color: "red",
    default_units: "px"
});

let t = P.create("Triangle", { base: 10, height: 50}, { color: "blue" });
t.translate(100, 100);
t.create("Ellipse", { radius: 10 }, { color: "green" });