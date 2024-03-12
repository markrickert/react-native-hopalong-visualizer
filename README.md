# React-Native "Hopalong Visualizer"

This is an example of using Three.js in react-native (expo sdk 50) to generate a "Hopalong" fractal. The Hopalong attractor is a visualizer generated by iterating a simple equation:

```
(x, y) -> (y - sign(x)*sqrt(abs(b*x - c)), a -x )
```

Where a, b, and c are random values.

---

This project was initialized with the [Ignite react-native boilerplate](https://github.com/infinitered/ignite) and uses `expo-gl` to implement the Three.js renderer. The Hopalong fractal is generated by iterating the above equation and plotting the points in 3D space.

You can touch and drag the screen to change the fractal's angle.

---

## Getting Started:

```ts
yarn
yarn prebuild:clean
yarn ios // or yarn android
```

> This will NOT work on the iOS emulator [for reasons](https://github.com/expo/expo-three?tab=readme-ov-file#usage). You'll need to run it on a physical device or on the android emulator.

## Credits:

* Original WebGL Chrome Experiment by [Iacopo Sassarini](https://experiments.withgoogle.com/webgl-attractors-trip)
* Updates [Sam Leatherdale](https://github.com/SamLeatherdale/hopalong-redux)
* This React-Native implementation by Mark Rickert

## Example:

![E74B5B6F-EB7B-4821-9F11-9C45A71421B9-15452-0001EA78E76ED6E1](https://github.com/markrickert/react-native-hopalong-visualizer/assets/139261/c662c42e-156f-4b1f-a440-55ea8b25d78a)
