package Goo.Animations

import Goo
import System

/// Creates exact-duration cubic simulation factories.
public class Cubic {
    private init() { }

    shared {
        /// Creates a cubic tween that preserves initial velocity and ends at rest.
        /// @param durationMs duration in milliseconds, including zero
        /// @returns a reusable exact-duration motion specification
        public func Tween(durationMs float64) MotionSpec {
            let duration = durationMs / 1000.0
            return MotionSpec(
                durationMs,
                (start float64, target float64, velocity float64) -> CubicSimulation(start, target, velocity, duration)
            )
        }
    }
}
