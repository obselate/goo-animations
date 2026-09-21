package Goo.Animations

import Goo
import System

/// Creates exact-duration cubic simulation factories.
public class Cubic {
    private init() { }

    shared {
        /// Creates a cubic tween that preserves initial velocity and ends at rest.
        /// @param duration duration in seconds, including zero
        /// @returns a reusable exact-duration motion specification
        public func Tween(duration float64) MotionSpec -> MotionSpec(
            duration,
            (start float64, target float64, velocity float64) -> CubicSimulation(start, target, velocity, duration)
        )
    }
}
