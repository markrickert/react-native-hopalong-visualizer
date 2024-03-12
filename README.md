# React-Native "Hopalong Visualizer"

This is an example of using Three.js in react-native (expo sdk 50) to generate a "Hopalong" fractal. The Hopalong attractor is a visualizer generated by iterating a simple equation:

```
(x, y) -> (y - sign(x)*sqrt(abs(b*x - c)), a -x )
```

Where a, b, and c are random values.

---

This project was initialized with the [Ignite react-native boilerplate](https://github.com/infinitered/ignite) and uses `expo-gl` to implement the Three.js renderer. The Hopalong fractal is generated by iterating the above equation and plotting the points in 3D space.

---

Credits:

* Original WebGL Chrome Experiment by [Iacopo Sassarini](https://experiments.withgoogle.com/webgl-attractors-trip)
* Updates [Sam Leatherdale](https://github.com/SamLeatherdale/hopalong-redux)
* This React-Native implementation by Mark Rickert
