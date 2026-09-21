package Goo.Animations

import Goo
import System

/// Creates delayed simulation factories.
public class Delay {
    private init() { }

    shared {
        /// Delays an existing scalar simulation factory.
        /// @param seconds nonnegative delay in seconds
        /// @param factory simulation factory evaluated after the delay
        /// @returns a delayed Goo scalar simulation factory
        public func By(seconds float64, factory(float64, float64, float64) -> Simulation)(
            float64,
            float64,
            float64
        ) -> Simulation {
            if !Double.IsFinite(seconds) || seconds < 0.0 {
                throw ArgumentOutOfRangeException("seconds")
            }
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
    }
}
