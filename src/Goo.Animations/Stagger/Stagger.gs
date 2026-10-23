package Goo.Animations

import Goo
import System

/// Starts the same transition across animated values at regular intervals.
public class Stagger {
    private init() { }

    shared {
        /// Gets the start time of one item in a staggered sequence.
        /// @param index zero-based item index
        /// @param intervalMs delay between adjacent items in milliseconds
        /// @param delayMs delay before the first item in milliseconds
        /// @returns the item's start time in milliseconds
        public func OffsetMs(index int32, intervalMs float64, delayMs float64 = 0.0) float64 {
            if index < 0 {
                throw ArgumentOutOfRangeException("index")
            }
            if !Double.IsFinite(intervalMs) || intervalMs < 0.0 {
                throw ArgumentOutOfRangeException("intervalMs")
            }
            if !Double.IsFinite(delayMs) || delayMs < 0.0 {
                throw ArgumentOutOfRangeException("delayMs")
            }

            let offset = delayMs + float64(index) * intervalMs
            if !Double.IsFinite(offset) {
                throw ArgumentOutOfRangeException("intervalMs")
            }
            return offset
        }

        /// Animates values toward one target with an increasing delay.
        /// @param animations animated values in start order
        /// @param target shared target value
        /// @param factory reusable scalar simulation factory
        /// @param intervalMs delay between adjacent values in milliseconds
        /// @param delayMs delay before the first value in milliseconds
        public func To[T](
            animations[]Anim[T],
            target T,
            factory(float64, float64, float64) -> Simulation,
            intervalMs float64,
            delayMs float64 = 0.0
        ) {
            OffsetMs(Math.Max(0, animations.Length - 1), intervalMs, delayMs)
            if factory == nil {
                throw ArgumentNullException("factory")
            }

            for index in 0 ... animations.Length {
                animations[index].To(target, Delay.By(OffsetMs(index, intervalMs, delayMs), factory))
            }
        }

        /// Animates values toward one target with an increasing delay.
        /// @param animations animated values in start order
        /// @param target shared target value
        /// @param spec exact-duration motion specification
        /// @param intervalMs delay between adjacent values in milliseconds
        /// @param delayMs delay before the first value in milliseconds
        public func To[T](animations[]Anim[T], target T, spec MotionSpec, intervalMs float64, delayMs float64 = 0.0) {
            if spec == nil {
                throw ArgumentNullException("spec")
            }

            To(animations, target, spec.Factory, intervalMs, delayMs)
        }
    }
}
