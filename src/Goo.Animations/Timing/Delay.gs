package Goo.Animations

import Goo
import System

/// Creates delayed simulation factories.
public class Delay {
    private init() { }

    shared {
        private func validate(delayMs float64) {
            if !Double.IsFinite(delayMs) || delayMs < 0.0 {
                throw ArgumentOutOfRangeException("delayMs")
            }
        }

        /// Delays an existing scalar simulation factory.
        /// @param delayMs nonnegative delay in milliseconds
        /// @param factory simulation factory wrapped by the delay
        /// @returns a delayed Goo scalar simulation factory
        public func By(delayMs float64, factory(float64, float64, float64) -> Simulation)(
            float64,
            float64,
            float64
        ) -> Simulation {
            validate(delayMs)
            if factory == nil {
                throw ArgumentNullException("factory")
            }

            if delayMs == 0.0 {
                return factory
            }

            let delay = delayMs / 1000.0
            return (start float64, target float64, velocity float64) -> DelaySimulation(
                start,
                delay,
                factory(start, target, velocity)
            )
        }

        /// Delays an exact-duration motion specification.
        /// @param delayMs nonnegative delay in milliseconds
        /// @param spec exact-duration motion specification
        /// @returns a delayed motion specification with the combined duration
        public func By(delayMs float64, spec MotionSpec) MotionSpec {
            validate(delayMs)
            if spec == nil {
                throw ArgumentNullException("spec")
            }

            return MotionSpec(delayMs + spec.DurationMs, By(delayMs, spec.Factory))
        }
    }
}
