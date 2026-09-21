package Goo.Animations

import Goo
import System

/// Describes a reusable scalar simulation with an exact duration.
public sealed class MotionSpec {
    private let factory(float64, float64, float64) -> Simulation
    private let duration float64

    /// Gets the reusable scalar simulation factory.
    public prop Factory(float64, float64, float64) -> Simulation {
        get -> factory
    }

    /// Gets the exact duration in seconds.
    public prop Duration float64 {
        get -> duration
    }

    /// Creates an exact-duration motion specification.
    /// @param duration exact duration in seconds, including zero
    /// @param factory reusable scalar simulation factory
    public init(duration float64, factory(float64, float64, float64) -> Simulation) {
        if !Double.IsFinite(duration) || duration < 0.0 {
            throw ArgumentOutOfRangeException("duration")
        }
        if factory == nil {
            throw ArgumentNullException("factory")
        }

        this.duration = duration
        this.factory = factory
    }
}

/// Animates toward a target with an exact-duration motion specification.
/// @param target value to animate toward
/// @param spec exact-duration motion specification
func (animation Anim[T]) To[T](target T, spec MotionSpec) {
    if spec == nil {
        throw ArgumentNullException("spec")
    }

    animation.To(target, spec.Factory)
}
