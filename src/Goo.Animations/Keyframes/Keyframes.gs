package Goo.Animations

import Goo
import System

/// Creates exact-duration authored scalar animation factories.
public class Keyframes {
    private init() { }

    shared {
        /// Creates a keyframe tween that intentionally ignores incoming velocity.
        /// @param duration total duration in seconds, including zero
        /// @param frames ordered authored frames from time zero to one
        /// @returns a reusable Goo scalar simulation factory
        public func Tween(duration float64, frames[]Keyframe)(float64, float64, float64) -> Simulation {
            if !Double.IsFinite(duration) || duration < 0.0 {
                throw ArgumentOutOfRangeException("duration")
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
                Motion.Tween(duration, frame.Easing)

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

            return (start float64, target float64, velocity float64) -> KeyframeSimulation(
                start,
                target,
                duration,
                copy
            )
        }
    }
}
