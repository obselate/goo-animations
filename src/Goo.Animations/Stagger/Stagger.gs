package Goo.Animations

import Goo
import System

/// Starts the same transition across animated values at regular intervals.
public class Stagger {
    private init() { }

    shared {
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
            if !Double.IsFinite(interval) || interval < 0.0 {
                throw ArgumentOutOfRangeException("interval")
            }
            if !Double.IsFinite(delay) || delay < 0.0 {
                throw ArgumentOutOfRangeException("delay")
            }
            if factory == nil {
                throw ArgumentNullException("factory")
            }

            for index in 0 ... animations.Length {
                animations[index].To(target, Delay.By(delay + float64(index) * interval, factory))
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
