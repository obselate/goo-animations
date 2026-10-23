package Goo.Animations

import Goo
import System

/// Creates exact-duration authored scalar animation factories.
public class Keyframes {
    private init() { }

    shared {
        /// Creates a keyframe tween that intentionally ignores incoming velocity.
        /// @param durationMs total duration in milliseconds, including zero
        /// @param frames ordered authored frames from time zero to one
        /// @returns a reusable exact-duration motion specification
        public func Tween(durationMs float64, frames[]Keyframe) MotionSpec {
            if !Double.IsFinite(durationMs) || durationMs < 0.0 {
                throw ArgumentOutOfRangeException("durationMs")
            }
            if frames.Length < 2 {
                throw ArgumentException("A keyframe tween requires at least two frames.")
            }

            let copy = [frames.Length]Keyframe

            for index in 0 ... frames.Length {
                let frame = frames[index]

                if !Double.IsFinite(frame.Time) || !Double.IsFinite(frame.Progress) || !Double.IsFinite(frame.Offset) {
                    throw ArgumentOutOfRangeException("frames")
                }
                if frame.Time < 0.0 || frame.Time > 1.0 {
                    throw ArgumentOutOfRangeException("frames")
                }
                if index > 0 && frame.Time <= copy[index - 1].Time {
                    throw ArgumentException("Keyframe times must be strictly increasing.")
                }
                Motion.Tween(durationMs, frame.Easing)

                copy[index] = frame
            }

            let first = copy[0]
            let last = copy[copy.Length - 1]

            if first.Time != 0.0 || first.Progress != 0.0 || first.Offset != 0.0 {
                throw ArgumentException("The first keyframe must describe the exact start.")
            }
            if last.Time != 1.0 || last.Progress != 1.0 || last.Offset != 0.0 {
                throw ArgumentException("The final keyframe must describe the exact target.")
            }

            let duration = durationMs / 1000.0
            return MotionSpec(
                durationMs,
                (start float64, target float64, velocity float64) -> KeyframeSimulation(start, target, duration, copy)
            )
        }

        /// Creates an offset animation whose target progress matches authored time.
        /// @param durationMs total duration in milliseconds, including zero
        /// @param offsets ordered offsets from time zero to one
        /// @param easing easing used by every segment
        /// @returns a reusable exact-duration motion specification
        public func Offsets(durationMs float64, offsets[]TimedOffset, easing Easing) MotionSpec {
            let frames = [offsets.Length]Keyframe

            for index in 0 ... offsets.Length {
                let offset = offsets[index]
                frames[index] = Keyframe{
                    Time: offset.Time,
                    Progress: offset.Time,
                    Offset: offset.Offset,
                    Easing: easing
                }
            }

            return Tween(durationMs, frames)
        }
    }
}
