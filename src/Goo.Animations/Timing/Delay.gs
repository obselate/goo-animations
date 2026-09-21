package Goo.Animations

import Goo
import System

/// Creates delayed simulation factories.
public class Delay {
    private init() { }

    shared {
        private func validate(seconds float64) {
            if !Double.IsFinite(seconds) || seconds < 0.0 {
                throw ArgumentOutOfRangeException("seconds")
            }
        }

        /// Delays an existing scalar simulation factory.
        /// @param seconds nonnegative delay in seconds
        /// @param factory simulation factory wrapped by the delay
        /// @returns a delayed Goo scalar simulation factory
        public func By(seconds float64, factory(float64, float64, float64) -> Simulation)(
            float64,
            float64,
            float64
        ) -> Simulation {
            validate(seconds)
            if factory == nil {
                throw ArgumentNullException("factory")
            }

            if seconds == 0.0 {
                return factory
            }

            return (start float64, target float64, velocity float64) -> DelaySimulation(
                start,
                seconds,
                factory(start, target, velocity)
            )
        }

        /// Delays an exact-duration motion specification.
        /// @param seconds nonnegative delay in seconds
        /// @param spec exact-duration motion specification
        /// @returns a delayed motion specification with the combined duration
        public func By(seconds float64, spec MotionSpec) MotionSpec {
            validate(seconds)
            if spec == nil {
                throw ArgumentNullException("spec")
            }

            return MotionSpec(seconds + spec.Duration, By(seconds, spec.Factory))
        }
    }
}
