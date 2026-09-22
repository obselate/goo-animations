# Motion API

Generated from `Goo.Animations.xml`. Source declarations supply type ownership and XML-emitter omissions.

## `MotionSpec`

Source:

- [`MotionSpec.gs`](../../src/Goo.Animations/MotionSpec.gs)

Describes a reusable scalar simulation with an exact duration.

### `new(float64,System.Func{float64,float64,float64,Simulation})`

Creates an exact-duration motion specification.

- `duration`: exact duration in seconds, including zero
- `factory`: reusable scalar simulation factory

### `Duration`

Gets the exact duration in seconds.

### `Factory`

Gets the reusable scalar simulation factory.

## `To<T>`

Source:

- [`MotionSpec.gs`](../../src/Goo.Animations/MotionSpec.gs)

Animates toward a target with an exact-duration motion specification.

### `To<T>(Anim{T},T,MotionSpec)`

Animates toward a target with an exact-duration motion specification.

- `target`: value to animate toward
- `spec`: exact-duration motion specification
