package Goo.Animations

import Goo
import System

/// Starts the same transition across animated values at regular intervals.
public class Stagger {
    private init() { }

    shared {
        /// Gets the start time of one item in a staggered sequence.
        /// @param index zero-based item index
        /// @param interval delay between adjacent items in seconds
        /// @param delay delay before the first item in seconds
        /// @returns the item's start time in seconds
        public func Offset(index int32, interval float64, delay float64 = 0.0) float64 {
            if index < 0 {
                throw ArgumentOutOfRangeException("index")
            }
            if !Double.IsFinite(interval) || interval < 0.0 {
                throw ArgumentOutOfRangeException("interval")
            }
            if !Double.IsFinite(delay) || delay < 0.0 {
                throw ArgumentOutOfRangeException("delay")
            }

            let offset = delay + float64(index) * interval
            if !Double.IsFinite(offset) {
                throw ArgumentOutOfRangeException("interval")
            }
            return offset
        }

        /// Animates values toward one target with an increasing delay.
        /// @param animations animated values in start order
        /// @param target shared target value
        /// @param factory reusable scalar simulation factory
        /// @param interval delay between adjacent values in seconds
        /// @param delay delay before the first value in seconds
        public func To[T](
            animations[]Anim[T],
            target T,
            factory(float64, float64, float64) -> Simulation,
            interval float64,
            delay float64 = 0.0
        ) {
            Offset(Math.Max(0, animations.Length - 1), interval, delay)
            if factory == nil {
                throw ArgumentNullException("factory")
            }

            for index in 0 ... animations.Length {
                animations[index].To(target, Delay.By(Offset(index, interval, delay), factory))
            }
        }

        /// Animates values toward one target with an increasing delay.
        /// @param animations animated values in start order
        /// @param target shared target value
        /// @param spec exact-duration motion specification
        /// @param interval delay between adjacent values in seconds
        /// @param delay delay before the first value in seconds
        public func To[T](animations[]Anim[T], target T, spec MotionSpec, interval float64, delay float64 = 0.0) {
            if spec == nil {
                throw ArgumentNullException("spec")
            }

            To(animations, target, spec.Factory, interval, delay)
        }
    }
}
