# Goo Animations

Reusable G# animation tools for [Goo Motion](https://github.com/obselate/goo/blob/main/docs/api/motion.md).

The API provides springs, exact-duration motion specifications, delays,
staggering, keyframes, finite playback, and timelines. Goo owns animated values,
the motion clock, and rendering.

## Install

Goo Animations `0.2.0` targets .NET 10 and depends on Goo `0.6.3`. Use
`Gsharp.NET.Sdk/0.4.591` and install the package from NuGet.org:

```sh
dotnet add YourApp.gsproj package Goo.Animations --version 0.2.0
```

## Use

```gs
import Goo
import Goo.Animations

offset.To(220.0, Spring.Damped(10.0, 0.5, 0.1, 1.0))

let pulse = Playback.PingPong(2, Cubic.Tween(0.3))
opacity.To(1.0, pulse)

Stagger.To(items, 1.0, Spring.Critical(14.0, 0.001, 0.01), 0.12)

let timeline = Timeline(this)
timeline.Run(0.6, reveal)
timeline.Run(0.4, settle)
timeline.Hold(1.0)
timeline.Loop()
timeline.Play(window)
```

Complete examples:

- [Plain Goo](https://github.com/obselate/goo-animations/tree/main/samples/Goo.Animations.QuickStart)
- [Goo.Widgets](https://github.com/obselate/goo-animations/tree/main/samples/Goo.Animations.Widgets)

## Build

The repository requires .NET SDK `10.0.401` and uses locked dependencies.

```sh
bash scripts/verify.sh
```

Verification runs pinned strict G# lint, all three Release builds, generated API
documentation consistency, package creation, package validation, and the repository
diff check.

## Links

- [API reference](https://github.com/obselate/goo-animations/tree/main/docs/api)
- [Release process](https://github.com/obselate/goo-animations/blob/main/.github/RELEASING.md)
- [Goo Motion API](https://github.com/obselate/goo/blob/main/docs/api/motion.md)
