# Timing API

Generated from `Goo.Animations.xml`. Source declarations supply type ownership and XML-emitter omissions.

## `Delay`

Source:

- [`Delay.gs`](../../src/Goo.Animations/Timing/Delay.gs)

Creates delayed simulation factories.

### `By(float64,MotionSpec)`

Delays an exact-duration motion specification.

- `seconds`: nonnegative delay in seconds
- `spec`: exact-duration motion specification

Returns: a delayed motion specification with the combined duration

### `By(float64,System.Func{float64,float64,float64,Simulation})`

Delays an existing scalar simulation factory.

- `seconds`: nonnegative delay in seconds
- `factory`: simulation factory wrapped by the delay

Returns: a delayed Goo scalar simulation factory
