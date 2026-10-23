# Stagger API

Generated from `Goo.Animations.xml`. Source declarations supply type ownership and XML-emitter omissions.

## `Stagger`

Source:

- [`Stagger.gs`](../../src/Goo.Animations/Stagger/Stagger.gs)

Starts the same transition across animated values at regular intervals.

```gs
let offsetMs = Stagger.OffsetMs(index, intervalMs, delayMs)
let position = simulation.Position(Math.Max(0.0, elapsed - offsetMs / 1000.0))
```

### `OffsetMs(int32,float64,float64)`

Gets the start time of one item in milliseconds. `index` starts at zero.
`intervalMs` and `delayMs` are nonnegative. All inputs and the result must be finite.

### `To<T>(Anim{T}[],T,MotionSpec,float64,float64)`

Animates values toward one target with an increasing delay.

- `animations`: animated values in start order
- `target`: shared target value
- `spec`: exact-duration motion specification
- `intervalMs`: delay between adjacent values in milliseconds
- `delayMs`: delay before the first value in milliseconds

### `To<T>(Anim{T}[],T,System.Func{float64,float64,float64,Simulation},float64,float64)`

Animates values toward one target with an increasing delay.

- `animations`: animated values in start order
- `target`: shared target value
- `factory`: reusable scalar simulation factory
- `intervalMs`: delay between adjacent values in milliseconds
- `delayMs`: delay before the first value in milliseconds
