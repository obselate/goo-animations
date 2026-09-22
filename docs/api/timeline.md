# Timeline API

Generated from `Goo.Animations.xml`. Source declarations supply type ownership and XML-emitter omissions.

## `Timeline`

Source:

- [`Timeline.gs`](../../src/Goo.Animations/Timeline/Timeline.gs)

Runs a sequence of timed animation actions on a window.

### `new(Cell)`

Creates a timeline owned by a cell.

- `owner`: cell that owns the timeline clock

### `Hold(float64)`

Appends a timed pause.

- `duration`: pause duration in seconds, including zero

Returns: this timeline

### `Loop`

Repeats the sequence until stopped.

Returns: this timeline

### `Play(Window)`

Starts or restarts the sequence.

- `window`: window used to defer step handoffs

### `Run(float64,System.Action)`

Appends a timed action.

- `duration`: step duration in seconds, including zero
- `action`: action run at the start of the step

Returns: this timeline

### `Stop`

Stops the sequence.

### `Running`

Gets whether the timeline is running.
