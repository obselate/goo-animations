package Goo.Animations

import Goo
import System

internal class SpringSimulation : Simulation {
    private let target float64
    private let omega float64
    private let underdamped bool
    private let overdamped bool
    private let coefficient float64
    private let decayRate float64
    private let frequency float64
    private let sineCoefficient float64
    private let slowRate float64
    private let fastRate float64
    private let slowCoefficient float64
    private let fastCoefficient float64
    private let positionAmplitude float64
    private let velocityAmplitude float64
    private let displacement float64
    private let initialVelocity float64
    private let positionTolerance float64
    private let velocityTolerance float64

    internal init(
        start float64,
        target float64,
        velocity float64,
        omega float64,
        dampingRatio float64,
        positionTolerance float64,
        velocityTolerance float64
    ) {
        this.target = target
        this.omega = omega
        underdamped = dampingRatio < 0.9999
        overdamped = dampingRatio > 1.0001
        this.positionTolerance = positionTolerance
        this.velocityTolerance = velocityTolerance
        displacement = start - target
        initialVelocity = velocity

        if underdamped {
            decayRate = dampingRatio * omega
            frequency = omega * Math.Sqrt(1.0 - dampingRatio * dampingRatio)
            sineCoefficient = (initialVelocity + decayRate * displacement) / frequency
            let velocitySineCoefficient = -frequency * displacement - decayRate * sineCoefficient
            positionAmplitude = Double.Hypot(displacement, sineCoefficient)
            velocityAmplitude = Double.Hypot(initialVelocity, velocitySineCoefficient)
        } else if overdamped {
            let root = Math.Sqrt(dampingRatio * dampingRatio - 1.0)
            slowRate = -omega * (dampingRatio - root)
            fastRate = -omega * (dampingRatio + root)
            slowCoefficient = (initialVelocity - fastRate * displacement) / (slowRate - fastRate)
            fastCoefficient = displacement - slowCoefficient
        } else {
            coefficient = initialVelocity + omega * displacement
        }
    }

    private func criticalDisplacement(elapsed float64) float64 ->
    (displacement + coefficient * elapsed) * Math.Exp(-omega * elapsed)

    private func criticalVelocity(elapsed float64) float64 {
        let linear = displacement + coefficient * elapsed
        return (coefficient - omega * linear) * Math.Exp(-omega * elapsed)
    }

    private func underdampedDisplacement(elapsed float64) float64 {
        let phase = frequency * elapsed
        let oscillation =
        displacement * Math.Cos(phase) + sineCoefficient * Math.Sin(phase)

        return Math.Exp(-decayRate * elapsed) * oscillation
    }

    private func underdampedVelocity(elapsed float64) float64 {
        let phase = frequency * elapsed
        let oscillation =
        displacement * Math.Cos(phase) + sineCoefficient * Math.Sin(phase)
        let oscillationVelocity =
        -displacement * frequency * Math.Sin(phase) + sineCoefficient * frequency * Math.Cos(phase)

        return Math.Exp(-decayRate * elapsed) *
        (oscillationVelocity - decayRate * oscillation)
    }

    private func overdampedDisplacement(elapsed float64) float64 ->
    slowCoefficient * Math.Exp(slowRate * elapsed) + fastCoefficient * Math.Exp(fastRate * elapsed)

    private func overdampedVelocity(elapsed float64) float64 ->
    slowRate * slowCoefficient * Math.Exp(slowRate * elapsed) + fastRate * fastCoefficient * Math.Exp(
        fastRate * elapsed
    )

    private func decayedMagnitude(magnitude float64, exponent float64) float64 {
        if magnitude == 0.0 {
            return 0.0
        }
        return Math.Exp(Math.Log(magnitude) + exponent)
    }

    private func decayedTimeMagnitude(magnitude float64, decayRate float64, elapsed float64) float64 {
        if magnitude == 0.0 {
            return 0.0
        }
        return Math.Exp(
            Math.Log(magnitude) + Math.Log(elapsed) -
            decayRate * elapsed
        )
    }

    private func decayedProductMagnitude(first float64, second float64, exponent float64) float64 {
        if first == 0.0 || second == 0.0 {
            return 0.0
        }
        return Math.Exp(Math.Log(first) + Math.Log(second) + exponent)
    }

    private func futureEnvelope(constant float64, slope float64, elapsed float64) float64 {
        let slopePeakTime = Math.Max(elapsed, 1.0 / omega)
        return decayedMagnitude(constant, -omega * elapsed) + decayedTimeMagnitude(slope, omega, slopePeakTime)
    }

    private func criticalDone(elapsed float64) bool {
        let positionBound =
        futureEnvelope(Math.Abs(displacement), Math.Abs(coefficient), elapsed)
        let velocityBound =
        futureEnvelope(Math.Abs(initialVelocity), omega * Math.Abs(coefficient), elapsed)

        return positionBound <= positionTolerance && velocityBound <= velocityTolerance
    }

    private func underdampedDone(elapsed float64) bool {
        let exponent = -decayRate * elapsed

        return decayedMagnitude(positionAmplitude, exponent) <= positionTolerance &&
            decayedMagnitude(velocityAmplitude, exponent) <= velocityTolerance
    }

    private func overdampedDone(elapsed float64) bool {
        let positionBound =
        decayedMagnitude(Math.Abs(slowCoefficient), slowRate * elapsed) +
            decayedMagnitude(Math.Abs(fastCoefficient), fastRate * elapsed)
        let velocityBound =
        decayedProductMagnitude(Math.Abs(slowRate), Math.Abs(slowCoefficient), slowRate * elapsed) +
            decayedProductMagnitude(Math.Abs(fastRate), Math.Abs(fastCoefficient), fastRate * elapsed)

        return positionBound <= positionTolerance && velocityBound <= velocityTolerance
    }

    public override func Position(elapsed float64) float64 {
        if Done(elapsed) {
            return target
        }

        let remaining = if underdamped {
            underdampedDisplacement(elapsed)
        } else if overdamped {
            overdampedDisplacement(elapsed)
        } else {
            criticalDisplacement(elapsed)
        }
        return target + remaining
    }

    public override func Velocity(elapsed float64) float64 {
        if Done(elapsed) {
            return 0.0
        }

        if underdamped {
            return underdampedVelocity(elapsed)
        }
        if overdamped {
            return overdampedVelocity(elapsed)
        }
        return criticalVelocity(elapsed)
    }

    public override func Done(elapsed float64) bool {
        if Double.IsNaN(elapsed) || elapsed < 0.0 {
            return false
        }
        if Double.IsPositiveInfinity(elapsed) {
            return true
        }

        if underdamped {
            return underdampedDone(elapsed)
        }
        if overdamped {
            return overdampedDone(elapsed)
        }

        return criticalDone(elapsed)
    }
}
