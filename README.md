# Goo Animations

Reusable G# simulation factories for [Goo Motion](https://github.com/obselate/goo/blob/main/docs/api/motion.md).

The API provides damped springs, delayed motion, velocity-preserving
cubic tweens, scalar keyframes, and finite repeat and ping-pong playback. Goo
continues to own animated values, timing, scheduling, and rendering.

## Install

Goo Animations `0.1.0` targets .NET 10 and depends on Goo `0.6.3`. Use
`Gsharp.NET.Sdk/0.4.591` and install the package from NuGet.org:

```sh
dotnet add YourApp.gsproj package Goo.Animations --version 0.1.0
```

## Use

```gs
import Goo
import Goo.Animations

offset.To(220.0, Spring.Damped(10.0, 0.5, 0.1, 1.0))
```

Complete examples:

- [Plain Goo](https://github.com/obselate/goo-animations/tree/main/samples/Goo.Animations.QuickStart)
- [Goo.Widgets](https://github.com/obselate/goo-animations/tree/main/samples/Goo.Animations.Widgets)

## Build

The repository requires .NET SDK `10.0.302` and uses locked dependencies.

```sh
bash scripts/verify.sh
```

Verification runs pinned strict G# lint, all three Release builds, package creation,
package validation, and the repository diff check.

## Links

- [Release process](https://github.com/obselate/goo-animations/blob/main/.github/RELEASING.md)
- [Goo Motion API](https://github.com/obselate/goo/blob/main/docs/api/motion.md)
