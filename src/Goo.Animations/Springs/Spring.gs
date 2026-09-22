package Goo.Animations

import Goo
import System

/// Creates reusable spring simulation factories.
public class Spring {
    private init() { }

    shared {
        /// Creates a critically damped scalar simulation factory.
        /// @param angularFrequency response speed in radians per second
        /// @param positionTolerance maximum settled distance from the target
        /// @param velocityTolerance maximum settled speed
        /// @returns a reusable Goo scalar simulation factory
        public func Critical(angularFrequency float64, positionTolerance float64, velocityTolerance float64)(
            float64,
            float64,
            float64
        ) -> Simulation -> Damped(angularFrequency, 1.0, positionTolerance, velocityTolerance)

        /// Creates a damped scalar simulation factory.
        /// @param angularFrequency response speed in radians per second
        /// @param dampingRatio positive damping ratio
        /// @param positionTolerance maximum settled distance from the target
        /// @param velocityTolerance maximum settled speed
        /// @returns a reusable Goo scalar simulation factory
        public func Damped(
            angularFrequency float64,
            dampingRatio float64,
            positionTolerance float64,
            velocityTolerance float64
        )(float64, float64, float64) -> Simulation {
            if !Double.IsFinite(angularFrequency) || angularFrequency <= 0.0 {
                throw ArgumentOutOfRangeException("angularFrequency")
            }
            if !Double.IsFinite(dampingRatio) || dampingRatio <= 0.0 {
                throw ArgumentOutOfRangeException("dampingRatio")
            }
            if !Double.IsFinite(positionTolerance) || positionTolerance <= 0.0 {
                throw ArgumentOutOfRangeException("positionTolerance")
            }
            if !Double.IsFinite(velocityTolerance) || velocityTolerance <= 0.0 {
                throw ArgumentOutOfRangeException("velocityTolerance")
            }

            return (start float64, target float64, velocity float64) ->
            SpringSimulation(
                start,
                target,
                velocity,
                angularFrequency,
                dampingRatio,
                positionTolerance,
                velocityTolerance
            )
        }
    }
}
