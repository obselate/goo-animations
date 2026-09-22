# Tweens API

Generated from `Goo.Animations.xml`. Source declarations supply type ownership and XML-emitter omissions.

## `Cubic`

Source:

- [`Cubic.gs`](../../src/Goo.Animations/Tweens/Cubic.gs)

Creates exact-duration cubic simulation factories.

### `Tween(float64)`

Creates a cubic tween that preserves initial velocity and ends at rest.

- `duration`: duration in seconds, including zero

Returns: a reusable exact-duration motion specification
