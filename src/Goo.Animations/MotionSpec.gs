package Goo.Animations

import Goo
import System

/// Describes a reusable scalar simulation with an exact duration.
public sealed class MotionSpec {
    private let factory(float64, float64, float64) -> Simulation
    private let durationMs float64

    /// Gets the reusable scalar simulation factory.
    public prop Factory(float64, float64, float64) -> Simulation {
        get -> factory
    }

    /// Gets the exact duration in milliseconds.
    public prop DurationMs float64 {
        get -> durationMs
    }

    /// Creates an exact-duration motion specification.
    /// @param durationMs exact duration in milliseconds, including zero
    /// @param factory reusable scalar simulation factory
    public init(durationMs float64, factory(float64, float64, float64) -> Simulation) {
        if !Double.IsFinite(durationMs) || durationMs < 0.0 {
            throw ArgumentOutOfRangeException("durationMs")
        }
        if factory == nil {
            throw ArgumentNullException("factory")
        }

        this.durationMs = durationMs
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
