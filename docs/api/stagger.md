# Stagger API

Generated from `Goo.Animations.xml`. Source declarations supply type ownership and XML-emitter omissions.

## `Stagger`

Source:

- [`Stagger.gs`](../../src/Goo.Animations/Stagger/Stagger.gs)

Starts the same transition across animated values at regular intervals.

### `To<T>(Anim{T}[],T,MotionSpec,float64,float64)`

Animates values toward one target with an increasing delay.

- `animations`: animated values in start order
- `target`: shared target value
- `spec`: exact-duration motion specification
- `interval`: delay between adjacent values in seconds
- `delay`: delay before the first value in seconds

### `To<T>(Anim{T}[],T,System.Func{float64,float64,float64,Simulation},float64,float64)`

Animates values toward one target with an increasing delay.

- `animations`: animated values in start order
- `target`: shared target value
- `factory`: reusable scalar simulation factory
- `interval`: delay between adjacent values in seconds
- `delay`: delay before the first value in seconds
