# Changelog

## Unreleased

## 0.4.0 - 2026-10-23

- Require Goo `[0.9.0, 0.10.0)`.

## 0.3.0 - 2026-10-23

- Require Goo `[0.8.0, 0.9.0)`.
- Breaking: authored durations and delays use milliseconds. Multiply seconds by 1000; names gain `Ms`.

## 0.2.7 - 2026-10-18

- Cache constructor-invariant spring coefficients and settling amplitudes without changing sampled output.
- Update the Widgets sample to Goo.Widgets `0.3.0` and ambient themes.

## 0.2.6 - 2026-10-09

- Build with G# SDK `0.4.1150`.

## 0.2.5 - 2026-09-29

- Support Goo `0.7.x` and restore against Goo `0.7.0`.

## 0.2.4 - 2026-09-28

- Expose `Stagger.Offset` for deterministic item start times and validate the full stagger before animating.
- Document pure spring sampling and the action timeline's seek limit.

## 0.2.3 - 2026-09-28

- Update the Goo dependency to `0.6.7`.
- Let timelines play without a Window argument using Goo's completed-motion signal.
- End looping timelines after the current iteration when reduced motion is active or `Motion.TimeScale` is disabled.

## 0.2.2 - 2026-09-28

- Update the Goo dependency to `0.6.6`.
- Update the Widgets sample for Goo.Widgets `0.2.6`.

## 0.2.0 - 2026-09-21

- Add exact-duration `MotionSpec` values and direct `Anim.To` support.
- Let delays preserve duration and let playback derive its cycle duration.
- Add `Timeline` for timed steps, holds, looping, and safe deferred handoffs.
- Add `Stagger.To` for indexed transition delays.
- Add `Keyframes.Offsets` and `TimedOffset` for additive keyframes.
- Update the widget samples for the new authoring APIs.
- Add Markdown API reference pages generated from the library XML documentation.

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
