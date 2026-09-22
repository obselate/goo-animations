# Springs API

Generated from `Goo.Animations.xml`. Source declarations supply type ownership and XML-emitter omissions.

## `Spring`

Source:

- [`Spring.gs`](../../src/Goo.Animations/Springs/Spring.gs)

Creates reusable spring simulation factories.

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
