# Keyframes API

Generated from `Goo.Animations.xml`. Source declarations supply type ownership and XML-emitter omissions.

## `Keyframe`

Source:

- [`Keyframe.gs`](../../src/Goo.Animations/Keyframes/Keyframe.gs)

Describes one point in an authored scalar animation. Time and Progress are normalized from zero through one. Offset is added to the interpolated value. Easing controls the segment from this frame to the next.

## `Keyframes`

Source:

- [`Keyframes.gs`](../../src/Goo.Animations/Keyframes/Keyframes.gs)

Creates exact-duration authored scalar animation factories.

### `Offsets(float64,TimedOffset[],Easing)`

Creates an offset animation whose target progress matches authored time.

- `duration`: total duration in seconds, including zero
- `offsets`: ordered offsets from time zero to one
- `easing`: easing used by every segment

Returns: a reusable exact-duration motion specification

### `Tween(float64,Keyframe[])`

Creates a keyframe tween that intentionally ignores incoming velocity.

- `duration`: total duration in seconds, including zero
- `frames`: ordered authored frames from time zero to one

Returns: a reusable exact-duration motion specification

## `TimedOffset`

Source:

- [`TimedOffset.gs`](../../src/Goo.Animations/Keyframes/TimedOffset.gs)

Describes an additive Offset at a normalized Time from zero through one.
