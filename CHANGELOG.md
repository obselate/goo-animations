# Changelog

## 0.2.0 - 2026-09-21

- Add exact-duration `MotionSpec` values and direct `Anim.To` support.
- Let delays preserve duration and let playback derive its cycle duration.
- Add `Timeline` for timed steps, holds, looping, and safe deferred handoffs.
- Add `Stagger.To` for indexed transition delays.
- Add `Keyframes.Offsets` and `TimedOffset` for additive keyframes.
- Update the widget samples for the new authoring APIs.
- Generate and verify Markdown API reference pages from the library XML documentation.

## 0.1.0 - 2026-09-21

- Establish the Goo.Animations library and plain Goo / Widgets samples.
- Reuse Goo Widgets build, package validation, CI, and release structure.
- Define animation ownership and scope.
- Add critically damped, underdamped, and overdamped spring factories.
- Add the `Delay.By` simulation decorator and staggered badge demonstration.
- Add the velocity-preserving `Cubic.Tween` factory and comparison demonstration.
- Add fixed-duration scalar keyframes with segment easing and a shake demonstration.
- Add finite repeat and ping-pong playback with widget demonstrations.
- Reuse Goo's tween simulations for keyframe easing.
- Centralize the spring regime terms used by evaluation and settling.
- Reject nil wrapped simulations in delay and playback decorators.
- Add pinned strict G# lint to repository verification.
