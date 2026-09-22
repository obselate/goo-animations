# Playback API

Generated from `Goo.Animations.xml`. Source declarations supply type ownership and XML-emitter omissions.

## `Playback`

Source:

- [`Playback.gs`](../../src/Goo.Animations/Playback/Playback.gs)

Creates finite playback decorators for exact-duration simulations.

### `PingPong(int32,MotionSpec)`

Plays forward once, then backward and forward for each round trip.

- `roundTrips`: number of backward-forward pairs after the initial forward leg
- `spec`: exact-duration motion specification

Returns: a reusable motion specification with the combined duration

### `Repeat(int32,MotionSpec)`

Replays a forward simulation a finite number of times.

- `count`: total number of forward cycles
- `spec`: exact-duration motion specification

Returns: a reusable motion specification with the combined duration
