# Timeline API

Generated from `Goo.Animations.xml`. Source declarations supply type ownership and XML-emitter omissions.

## `Timeline`

Source:

- [`Timeline.gs`](../../src/Goo.Animations/Timeline/Timeline.gs)

Runs a sequence of timed actions on a cell-owned motion clock.

```gs
let timeline = Timeline(owner)
timeline.Run(0.2, reveal)
timeline.Hold(0.1)
timeline.Run(0.2, settle)
timeline.Play()
```

The timeline needs no `Window` argument. Disposing `owner` stops it: `Running` becomes false and later calls to `Play` throw `ObjectDisposedException`. Reduced motion or `Motion.TimeScale <= 0` completes each step immediately. Finite sequences still run every step in order; a loop completes its current pass, then stops.

`Run` accepts arbitrary actions and calls each at the start of its step. Those
effects cannot be reconstructed from elapsed time, so this action timeline
does not support seeking. Use pure `Simulation.Position` and `Velocity` samples
for frame-exact rendering.

### `new(Cell)`

Creates a timeline owned by a cell.

- `owner`: cell that owns the timeline clock

### `Hold(float64)`

Appends a timed pause.

- `duration`: pause duration in seconds, including zero

Returns: this timeline

### `Loop`

Repeats the sequence until stopped. When reduced motion is active or `Motion.TimeScale <= 0`, the current iteration finishes and the timeline stops instead of looping again.

Returns: this timeline

### `Play()`

Starts or restarts the sequence.

### `Play(Window)`

Starts or restarts the sequence. Retained for source compatibility; the window is ignored.

### `Run(float64,System.Action)`

Appends a timed action.

- `duration`: step duration in seconds, including zero
- `action`: action run at the start of the step

Returns: this timeline

### `Stop`

Stops the sequence.

### `Running`

Gets whether the timeline is running.
