# Springs API

Generated from `Goo.Animations.xml`. Source declarations supply type ownership and XML-emitter omissions.

## `Spring`

Source:

- [`Spring.gs`](../../src/Goo.Animations/Springs/Spring.gs)

Creates reusable spring simulation factories.

The returned factory creates a `Simulation` without a cell or clock. Sample its
position and velocity at any elapsed time in seconds, including repeated or
earlier times:

```gs
let spring = Spring.Damped(11.0, 0.56, 0.001, 0.01)(0.0, 1.0, 0.0)
let position = spring.Position(elapsed)
let velocity = spring.Velocity(elapsed)
```

### `Critical(float64,float64,float64)`

Creates a critically damped scalar simulation factory.

- `angularFrequency`: response speed in radians per second
- `positionTolerance`: maximum settled distance from the target
- `velocityTolerance`: maximum settled speed

Returns: a reusable Goo scalar simulation factory

### `Damped(float64,float64,float64,float64)`

Creates a damped scalar simulation factory.

- `angularFrequency`: response speed in radians per second
- `dampingRatio`: positive damping ratio
- `positionTolerance`: maximum settled distance from the target
- `velocityTolerance`: maximum settled speed

Returns: a reusable Goo scalar simulation factory
